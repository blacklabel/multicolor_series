'use strict';

const gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	sourcemaps = require('gulp-sourcemaps'),
	closureCompiler = require('google-closure-compiler').gulp(),
	gutil = require('gulp-util'),
	bump = require('gulp-bump'),
	git = require('gulp-git'),
	gulpif = require('gulp-if'),
	args = require('yargs').argv,
	fs = require('fs'),
	dateformat = require('dateformat'),
	gulpTypescript = require("gulp-typescript"),
	through2 = require('through2'),
	tsProject = gulpTypescript.createProject("tsconfig.json");

let files = ['./js/multicolor_series.js', 'js/demo.js'],
	decorator,
	version;

decorator = [
	'/**',
	'----',
	'*',
	'* (c) 2012-2022 Black Label',
	'*',
	'* License: Creative Commons Attribution (CC)',
	'*/',
	''
];

gulp.task("build", () => {
	return tsProject
    	.src()
    	.pipe(tsProject())
    	.js.pipe(through2.obj(async function (file, _encoding, callback) {
			if (file.isBuffer()) {
				let fileContent = file.contents.toString('utf8');
				const removedSpecifiers = [],
					removedPaths = [],
					importPathReg = /import (.+?) from ["'](.+?)["'];/g,
					formattedPathReg = /^highcharts\/ts\//;

				fileContent = fileContent.replace(importPathReg, (_match, specifier, path) => {
					removedSpecifiers.push(specifier);
			   		removedPaths.push(`${path.replace(formattedPathReg, "")}.js`);
			   		return '';
				});

		  		const iifeCode = `(function (factory) {
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

		  		file.contents = Buffer.from(iifeCode, 'utf8');
			}

			this.push(file);
			callback();
	  	}))
		.pipe(gulp.dest('dist'));
});

gulp.task('lint', function () {
	return gulp.src(files)
		.pipe(eslint())
		.pipe(gulpif(args.failonerror, eslint.failOnError()))
		.pipe(eslint.formatEach());
});

gulp.task('lint-watch', function () {
	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.formatEach());
});

gulp.task('compile', function () {
	return gulp.src(files[0])
	  .pipe(closureCompiler({
		  compilation_level: 'SIMPLE',
		  warning_level: 'VERBOSE',
		  language_in: 'ECMASCRIPT6_STRICT',
		  language_out: 'ECMASCRIPT5_STRICT',
		  output_wrapper: '(function(){\n%output%\n}).call(this)',
		  js_output_file: 'multicolor_series.min.js',
		  externs: 'compileExterns.js'
		}))
	  .pipe(sourcemaps.write('/'))
	  .pipe(gulp.dest('./js'));
});

gulp.task('add-decorator', function (done) {
	var minFile = './js/multicolor_series.min.js',
		main = fs.readFileSync(files[0], 'utf8'),
		min = fs.readFileSync(minFile, 'utf8'),
		old = main.match('(.*\r?\n){7}')[0];

	fs.writeFileSync(files[0], main.replace(old, decorator.join('\n')), 'utf8');
	fs.writeFileSync(minFile, decorator.join('\n') + min, 'utf8');

	done();
});

gulp.task('get-version', function (done) {
	var options = fs.readFileSync('package.json', {encoding: 'utf8'}),
		optJSON = JSON.parse(options),
		now = new Date();

	version = optJSON.version;
	decorator[1] = '* Multicolor Series v' + version + '(' + dateformat(now, 'yyyy-mm-dd') + ')';
	done();
});

gulp.task('release-commit', function (done) {
	var message = 'Release version ' + version;
	gulp.src(['package.json', 'manifest.json', 'js/*'])
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

	var type = args.type;
	var v = args.ver;
	var options = {};
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
	gutil.log([
		'\n',
		gutil.colors.yellow('TASKS: '),
		gutil.colors.cyan('prerelease:') + ' lind and compile sources',
		gutil.colors.cyan('lint      :') + ' lint JS files',
		gutil.colors.cyan('compile   :') + ' compile JS files',
		gutil.colors.cyan('watch     :') + ' watch changes in JS files and automatically lint',
		gutil.colors.cyan('release   :') + ' updates a version, usage: ',
		gutil.colors.blue('      1. gulp release:') + ' releases the package to the next minor revision.', 
		'                       Includes: liniting, compiling, commit with new tags, merge with gh-pages, and push to the repo for commits and tags.',
		'                       i.e. from 0.1.1 to 0.1.2',
		gutil.colors.blue('      2. gulp release --ver 1.1.1') + '        => Release the package with specific version.',
		gutil.colors.blue('      3. gulp release --type major') + '       => Increment major: 1.0.0',
		gutil.colors.blue('         gulp release --type minor') + '       => Increment minor: 0.1.0',
		gutil.colors.blue('         gulp release --type patch') + '       => Increment patch: 0.0.2',
		gutil.colors.blue('         gulp release --type prerelease') + '  => Sets prerelease: 0.0.1-2',
		''
	].join('\n'));
	done();
});


gulp.task('watch', function () {
	return gulp.watch(files, gulp.series('lint-watch'));
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
