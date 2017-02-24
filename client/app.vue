<template>
	<div>
		<div id="outer_wrapper">
			<wf-header></wf-header>
			<wf-navigate></wf-navigate>
			<div id="main_content">
				<router-view></router-view>
			</div>
		</div>
		<wf-footer></wf-footer>
	</div>
</template>

<script>
	import wfHeader from './components/header';
	import wfNavigate from './components/navigation';
	import wfFooter from './components/footer';

	export default {
		name: 'app',
		data() {
			return {

			};
		},
		components: {
			wfHeader,
			wfNavigate,
			wfFooter,
		},
	};
</script>

<style>
	html, body {
		height: 100%;
		width: 1000px;
		margin-left: auto;
		margin-right: auto;
		padding: 0;
		font-family: adobe-clean, myriad-pro, sans-serif;
		background-color: #373737;
		font-size: 16px;
	}

	#outer_wrapper::after {
		content: '';
		display: block;
		height: 75px;
	}

	div.modal_container {
		display: none;
		background-color: rgba(0, 0, 0, .75);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}

	div.modal_content {
		position: absolute;
		height: auto;
		width: auto;
		max-width: 80vw;
		max-height: 80vh;
		color: #666;
		background: #fff;
		top: 50%;
		left: 50%;
		margin: auto;
		padding: 36px;
		-ms-transform: translateX(-50%) translateY(-50%);
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	div.modal_close {
		position: absolute;
		top: -10px;
		right: -21px;
		cursor: pointer;
		padding: 1px 7px 3px 7px;
		background-color: #b2adad;
		vertical-align: middle;
		border-radius: 100%;
		font-size: 12pt;
		text-align: center;
		color: #000000;
	}

	#subscribe_popup {
		text-align: center;
	}

	button {
		background: linear-gradient(to top, #0198df 0, #00a3fe 100%);
		border-radius: 6px;
		min-width: 250px;
		padding: 6px 12px;
		color: #ffffff;
		text-shadow: none;
		box-shadow: inset .1em .1em 0 0 #d5d5d5, inset -.0825em -.0825em 0 0 #d5d5d5;
		border: 0;
		font-size: small;
		font-weight: bold;
	}

	.left {
		display: table-cell;
		vertical-align: middle;
	}

	.right {
		display: table-cell;
		vertical-align: middle;
		text-align: left;
		width: 210px;
	}

	#main_content {
		padding: 5px;
		max-width: 800px;
		margin: auto;
	}

	#outer_wrapper {
		min-height: 100%;
		margin: 0 auto -75px;
	}

	strong {
		color: #484645;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	a img {
		border: 0;
	}
	.cloud_name {
		font-weight: bold;
		font-size: 20px;
		color: #373737;
		vertical-align: middle;
		display: inline-block;
	}
	.absmiddle {
		vertical-align: middle;
	}

	.service_box {
		background-color: #ffffff;
		border: 1px solid #f3f4f5;
		border-radius: 6px;
		box-shadow: 0 1px 0 0 rgba(35, 31, 32, .12);

		margin-bottom: 20px;
	}

	.column_container {
		display: table;
		width: 100%;
		box-sizing: border-box;
		padding-left: 20px;
		border-top: 1px solid #f3f4f5;
	}

	.column_container.cloud_box {
		height: 110px;
	}

	a .column_container.cloud_box:hover {
		border-radius: 6px;
		box-shadow: 0 1px 2px 0 rgba(35, 31, 32, .22);
	}

	.capability_name:hover {
		opacity: .9;
	}

	.column_container.solution_box {
		height: 40px;
	}

	.column_container.solution_box:not(:first-of-type) {
		margin-top: 30px;
	}

	.column_container.solution_box + .column_container.capability_box {
		border-top: 0;
		height: 38px;
	}

	.column_container.solution_box + .column_container.capability_box div {
		vertical-align: top;
	}

	.column_container.capability_box {
		padding-left: 95px;
		height: 50px;
	}

	.no_solution_capability_box {
		height: 50px;
		padding-left: 95px;
	}

	.no_solution_capability_box .left {
		font-weight: bold;
	}

	.global_message {
		white-space: pre-line;
		padding: 10px;
	}

	.status {
		padding-right: 30px;
		white-space: nowrap;
	}

	.status img {
		vertical-align: middle;
		padding-right: 10px;
	}

	.status.external:before {
		opacity: 0;
	}

	.status.external {
		font-style: italic;
		font-size: 15px;
		color: #4c4b4c;
		opacity: .5;
	}

	.status_text {
		font-size: 14px;
		color: #4c4b4c;
		opacity: .70;
		vertical-align: middle;
		display: inline-block;
		white-space: normal;
	}

	.status_link:hover {
		cursor: pointer;
	}

	.status_link:hover .status_text {
		opacity: 1;
	}

	.tabs div.tab_panel .solution_box:first-of-type {
		border-top: 0;
	}

	.tabs > ul {
		border-bottom: 1px solid #f3f4f5;
		text-align: right;
		padding-bottom: 7px;
	}

	.tabs > ul > li {
		color: #000000;
		display: inline;
		list-style-type: none;
		margin-right: 20px;
		cursor: pointer;
		padding-bottom: 6px;
		opacity: 0.6;
	}

	.tabs > ul > li.selected {
		border-bottom: 2px solid #698eca;
		opacity: 1;
	}

	.popup_box {
		position: absolute;
		border: 1px solid #f3f4f5;
		box-shadow: 0 0 2px 1px rgba(35, 31, 32, .12);
		background-color: #ffffff;
		padding: 30px 15px;
		border-radius: 6px;
		min-width: 60px;
		max-width: 700px;
		z-index: 100;
	}

	.popup_box::before, .popup_box::after {
		content: "";
		position: absolute;
		bottom: 100%;
		left: 90%;
		border: solid transparent;
		transform-origin: 100% 100%;
		transform: rotate(-45deg);
	}

	.popup_box::before {
		margin-left: -8px;
		border-width: 8px;
		border-color: #f3f4f5 #f3f4f5 transparent transparent;
		box-shadow: 1px -1px 2px 0 rgba(35, 31, 32, .12);
	}

	.popup_box::after {
		margin-left: -7px;
		border-width: 7px;
		border-color: #ffffff #ffffff transparent transparent;
	}

	.popup_box.open_up::before, .popup_box.open_up::after {
		top: 100%;
		transform-origin: 0 0;
		transform: rotate(-45deg);
	}

	.popup_box.open_up::before {
		border-color: transparent transparent #f3f4f5 #f3f4f5;
		box-shadow: -1px 1px 2px 0 rgba(35, 31, 32, .12);
	}

	.popup_box.open_up::after {
		border-color: transparent transparent #ffffff #ffffff;
	}

	.popup_header {
		text-align: center;
		font-size: 200%;
	}

	.popup_content {
		max-height: 400px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.form_field {
		display: inline-block;
		text-align: left;
	}

	.error_message_box {
		border: 1px solid #ed6262;
		background-color: #ffe2e2;
		padding: 7px;
		text-align: left;
	}

	.support_message {
		text-align: right;
		white-space: nowrap;
		vertical-align: bottom;
		font-size: 14px;
	}

	.support_message a {
		color: #00A4E4;
	}

	.support_message a:hover {
		text-decoration: underline;
	}

	.top_headline_container {
		padding: 10px 0 16px 0;
	}

	.top_headline {
		font-size: 200%;
		color: #474645;
	}

	label {
		font-size: x-small;
		font-weight: bold;
		color: #c1c1c1;
	}

	input {
		padding: 6px 12px;
		border-radius: 4px;
		border: 0;
		box-shadow: inset .1em .1em 0 0 #d5d5d5, inset -.0825em -.0825em 0 0 #d5d5d5;
		width: 250px;
	}

	hr {
		margin: 20px 0;
	}
</style>
