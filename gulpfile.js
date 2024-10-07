'use strict';

const gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	sourcemaps = require('gulp-sourcemaps'),
	closureCompiler = require('google-closure-compiler').gulp(),
	babel = require('gulp-babel'),
	colors = require('ansi-colors'),
	log = require('fancy-log'),
	bump = require('gulp-bump'),
	git = require('gulp-git'),
	args = require('yargs').argv,
	fs = require('fs'),
	gulpTypescript = require("gulp-typescript"),
	through2 = require('through2'),
	rename = require('gulp-rename'),
	tsProject = gulpTypescript.createProject("tsconfig.json");

let files = ['./dist/multicolor-series.js', 'demo.js'],
	decorator,
	version;

decorator = [
	'/**',
	'----',
	'*',
	'* (c) 2012-2024 Black Label',
	'*',
	'* License: MIT',
	'*/',
	''
];

gulp.task("compile", () => {
	return tsProject
    	.src()
    	.pipe(tsProject())
    	.js
		.pipe(rename('multicolor-series.js'))
		.pipe(through2.obj(async function (file, _encoding, callback) {
			if (file.isBuffer()) {
				let fileContent = file.contents.toString('utf8');
				const removedSpecifiers = [],
					removedPaths = [],
					importPathReg = /import (.+?) from ["'](.+?)["'];/g,
					formattedPathReg = /^highcharts-github\/ts\//,
					exportReg = /\bexport\s*{[^}]*};?/g;

				fileContent = fileContent.replace(importPathReg, (_match, specifier, path) => {
					removedSpecifiers.push(specifier);
			   		removedPaths.push(`${path.replace(formattedPathReg, "")}.js`);
			   		return '';
				});

				fileContent = fileContent.replace(exportReg, '');

		  		const wrappedFileContent = decorator.join('\n') +
`(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	const _modules = Highcharts ? Highcharts._modules : {},
		_registerModule = (obj, path, args, fn) => {
			if (!obj.hasOwnProperty(path)) {
				obj[path] = fn.apply(null, args);

				if (typeof CustomEvent === 'function') {
					window.dispatchEvent(new CustomEvent(
						'HighchartsModuleLoaded',
						{ detail: { path: path, module: obj[path] } }
					));
				}
			}
		}

		_registerModule(
			_modules,
			'Extensions/MulticolorSeries.js',
			[${removedPaths.map((path) => `_modules[${`'${path}'`}]`)}],
			(${removedSpecifiers.map((specifier) => specifier)}) => {
				${fileContent}
			}
		)
}));`;
		  		file.contents = Buffer.from(wrappedFileContent, 'utf8');
			}

			this.push(file);
			callback();
	  	}))
		.pipe(gulp.dest('dist'))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env'],
			overrides: [{
				presets: [["@babel/preset-env", { targets: "defaults" }]]
		  	}]
		}))
		.pipe(closureCompiler({
			compilation_level: 'SIMPLE',
			warning_level: 'DEFAULT', // VERBOSE
			language_in: 'ECMASCRIPT6_STRICT',
			language_out: 'ECMASCRIPT5_STRICT',
			output_wrapper: '(function(){\n%output%\n}).call(this)',
			js_output_file: 'multicolor-series.min.js',
			externs: 'compileExterns.js'
		}))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('dist'))
});

gulp.task('lint', function () {
	return gulp.src(['ts/*.ts'])
	  	.pipe(eslint())
	  	.pipe(eslint.format())
	  	.pipe(eslint.failAfterError());
});

gulp.task('build', gulp.series('lint', 'compile'));

gulp.task('add-decorator', function (done) {
	const minFile = './dist/multicolor-series.min.js',
		main = fs.readFileSync(files[0], 'utf8'),
		min = fs.readFileSync(minFile, 'utf8'),
		old = main.match('(.*\r?\n){7}')[0];

	fs.writeFileSync(files[0], main.replace(old, decorator.join('\n')), 'utf8');
	fs.writeFileSync(minFile, decorator.join('\n') + min, 'utf8');

	done();
});

gulp.task('get-version', function (done) {
	const options = fs.readFileSync('package.json', {encoding: 'utf8'}),
		optJSON = JSON.parse(options),
		now = new Date();

	version = optJSON.version;
	decorator[1] = '* Multicolor Series v' + version + ' (' + now.toLocaleDateString('en-CA') + ')';
	done();
});

gulp.task('release-commit', function (done) {
	const message = 'Release version ' + version;
	gulp.src(['package.json', 'manifest.json', 'dist/*'])
		.pipe(git.add())
		.pipe(git.commit(message, {emitData: true}))
		.on('data', function (data) {
			done();
		})
		.pipe(git.tag('v' + version, message));
});

gulp.task('checkout-master', function (done) {
	git.checkout('master', function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('checkout-gh-pages', function (done) {
	git.checkout('gh-pages', function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('merge-with-master', function (done) {
	git.merge('master', function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('push-tags', function (done) {
	git.push('origin', 'master', {args: " --tags"}, function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('push-gh-pages', function (done) {
	git.push('origin', 'master', function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('push-master', function (done) {
	git.push('origin', 'gh-pages', function (err) {
		if (err) throw err;
		done();
	});
});

gulp.task('bump-files', function () {
	// Props to: http://stackoverflow.com/questions/36339694/how-to-increment-version-number-via-gulp-task

	const type = args.type;
	const v = args.ver;
	let options = {};
	if (v) {
		options.version = v;
	} else {
		options.type = type;
	}

	return gulp
		.src(['package.json', 'manifest.json'])
		.pipe(bump(options))
		.pipe(gulp.dest('./'));
});

gulp.task('default', function (done) {
	log([
		'\n',
		colors.yellow('TASKS: '),
		colors.cyan('prerelease:') + ' lint and compile sources',
		colors.cyan('lint      :') + ' lint TS files',
		colors.cyan('compile   :') + ' compile TS files',
		colors.cyan('watch     :') + ' watch changes in TS files and automatically lint',
		colors.cyan('release   :') + ' updates a version, usage: ',
		colors.blue('      1. gulp release:') + ' releases the package to the next minor revision.',
		'                       Includes: linting, compiling, commit with new tags, merge with gh-pages, and push to the repo for commits and tags.',
		'                       i.e. from 0.1.1 to 0.1.2',
		colors.blue('      2. gulp release --ver 1.1.1') + '        => Release the package with specific version.',
		colors.blue('      3. gulp release --type major') + '       => Increment major: 1.0.0',
		colors.blue('         gulp release --type minor') + '       => Increment minor: 0.1.0',
		colors.blue('         gulp release --type patch') + '       => Increment patch: 0.0.2',
		colors.blue('         gulp release --type prerelease') + '  => Sets prerelease: 0.0.1-2',
		''
	].join('\n'));
	done();
});


gulp.task('watch', function () {
	return gulp.watch('ts/*.ts', gulp.series('lint', 'compile'));
});

gulp.task('prerelease', gulp.series('lint', 'compile'));

gulp.task('release',
	gulp.series(
		'lint',
		'compile',

		'bump-files',
		'get-version',
		'add-decorator',
		'release-commit',

		'checkout-gh-pages',
		'merge-with-master',
		'checkout-master',

		'push-gh-pages',
		'push-master',
		'push-tags'

		//'npm-publish'
	)
);
