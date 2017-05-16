'use strict';
// version 0.1.1

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Counters = function () {
	function Counters(options) {
		_classCallCheck(this, Counters);

		this.hourStart = 1;
		this.hourEnd = 0;

		this.secondMS = 1;
		this.minuteMS = 60; // * this.secondMS
		this.hourMS = 60; // * this.minuteMS
		this.dayMS = 24; // * this.hourMS


		this.actionTime = this.dayMS - this.hourStart + this.hourEnd;

		this.now();
		this.start();
		setInterval(this.now.bind(this), 1000);
	}

	_createClass(Counters, [{
		key: 'start',
		value: function start() {
			var _this = this;

			var counters = document.querySelectorAll('[data-counter]');

			if (!counters.length) {
				throw new Error('Нету счетчиков на странице');
			}

			for (var i = 0; i < counters.length; i++) {

				var elements = counters[i].querySelectorAll('[data-counter-element]');

				if (!elements.length) {
					throw new Error('Счетчик у элемента ' + counters[i].className + ' установлен не правильно, не хватает дополнительных дата-атрибутов у дочерних элементов о типе счетчика');
				}

				var _loop = function _loop() {
					var elem = elements[q];
					var counterType = elem.dataset.counterElement;
					switch (counterType) {

						case 'clock':
							_this.clock(elem);
							break;

						case 'text':

							_this.text(elem);

							setInterval(function () {

								_this.text(elem);
							}, _this.minuteMS * 1000);

							break;

						case 'progressLine':

							_this.progressLine(elem);

							setInterval(function () {

								_this.progressLine(elem);
							}, _this.minuteMS * 1000);

							break;
						case 'progressLineSVG':

							_this.progressLine(elem);
							a = elem.querySelector('path');
							b = a.getTotalLength();

							a.style.strokeDasharray = b;
							a.style.strokeDashoffset = b;

							setInterval(function () {

								_this.progressLine(elem);
							}, _this.minuteMS * 1000);

							break;

					}
				};

				for (var q = 0; q < elements.length; ++q) {
					var a;
					var b;

					_loop();
				}
			}
		}
	}, {
		key: 'now',
		value: function now() {
			this.date = new Date();
			this.year = this.date.getFullYear();
			this.month = this.date.getMonth();
			this.day = this.date.getDate();
			this.hour = this.date.getHours();
			this.minutes = this.date.getMinutes();
			this.seconds = this.date.getSeconds();
			this.yesterday = new Date(this.year, this.month, this.day - 1);
			this.today = new Date(this.year, this.month, this.day);
			this.tomorrow = new Date(this.year, this.month, this.day + 1);
			this.progress();
		}
	}, {
		key: 'progress',
		value: function progress() {
			// 1 -> 0 
			if (this.hour > this.hourEnd && this.hour < this.hourStart) {
				this.progressValue = 1;
				return;
			}

			if (this.hour < 1) {
				this.progressValue = (this.dayMS * this.minuteMS - 1 * this.minuteMS - this.minutes) / (this.actionTime * this.minuteMS);
				return;
			}

			this.progressValue = (this.dayMS * this.minuteMS - this.hour * this.minuteMS - this.minutes) / (this.actionTime * this.minuteMS);
		}
	}, {
		key: 'clock',
		value: function clock(element) {
			var _this2 = this;

			var reverse = element.hasAttribute('data-counter-clock-reverse') ? true : false;

			var clockTime = void 0;
			if (reverse) {
				clockTime = this.__clockMathReverse;
			} else {
				clockTime = this.__clockMath;
			}

			var hours = element.querySelector('[data-counter-clock="hours"]');
			var minutes = element.querySelector('[data-counter-clock="minutes"]');
			var seconds = element.querySelector('[data-counter-clock="seconds"]');

			function startClock() {

				var a = clockTime.call(this);

				a = this.__clockDesign(a);

				hours.innerHTML = a[0];
				minutes.innerHTML = a[1];
				seconds.innerHTML = a[2];
			}

			startClock.call(this);

			setInterval(function () {
				startClock.call(_this2);
			}, 1000);
		}
	}, {
		key: '__clockDesign',
		value: function __clockDesign(time) {

			if (time[0] < 10 && time[0] >= 0) time[0] = '0' + time[0];

			if (time[1] < 10 && time[1] >= 0) time[1] = '0' + time[1];

			if (time[2] < 10 && time[2] >= 0) time[2] = '0' + time[2];

			return [time[0], time[1], time[2]];
		}
	}, {
		key: '__clockReverseDesign',
		value: function __clockReverseDesign(time) {
			if (time[2] == 60) {
				time[2] = 0;
			} else time[1]--;
			if (time[1] == 60) {
				time[1] = 0;
			} else time[0]--;
			if (time[0] == 24) {
				time[0] = 0;
			}
			return [time[0], time[1], time[2]];
		}
	}, {
		key: '__clockMath',
		value: function __clockMath() {
			return [this.hour, this.minutes, this.seconds];
		}
	}, {
		key: '__clockMathReverse',
		value: function __clockMathReverse() {
			var hours = this.dayMS - this.hour;
			var minutes = this.hourMS - this.minutes;
			var seconds = this.minuteMS - this.seconds;

			var fullTime = [hours, minutes, seconds];
			return this.__clockReverseDesign(fullTime);
		}
	}, {
		key: 'progressLine',
		value: function progressLine(element) {
			var lineLength = 100 * this.progressValue;
			element.style.width = (lineLength < 4 ? 4 : 100 * this.progressValue) + '%';
		}
	}, {
		key: 'progressLineSVG',
		value: function progressLineSVG(element) {
			var lineLength = 100 * this.progressValue;
			element.style.width = (lineLength < 4 ? 4 : 100 * this.progressValue) + '%';
		}
	}, {
		key: 'text',
		value: function text(element) {
			var maxItems = 50;
			var items = Math.round(maxItems * this.progressValue);
			element.innerHTML = items < 3 ? 3 : items;
		}
	}]);

	return Counters;
}();

document.addEventListener('DOMContentLoaded', function () {
	try {
		new Counters();
	} catch (err) {
		console.log(err.message);
	}
});
