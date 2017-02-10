<template>
	<div class="footer">
		<div class="language_div">
			<span class="language_selector">
				<span class="choose_language localize_text" data-localize-key="footer_change_language"
					  data-localize-default-text="Change Language"></span>
			</span>
		</div>
		<div class="nav_links">
			<span class="copyright localize_text" data-localize-key="footer_copyright"
				  data-localize-default-text="Copyright &copy;2017 Adobe Systems Incorporated. All rights reserved."></span>
			<a href="//www.adobe.com/privacy.html">
				<span class="localize_text" data-localize-key="footer_privacy" data-localize-default-text="Privacy">Privacy</span>
			</a>
			<span class="nav_divider">/</span>
			<a href="//www.adobe.com/legal/general-terms.html">
				<span class="localize_text" data-localize-key="footer_terms" data-localize-default-text="Terms of Use">Terms of Use</span>
			</a>
			<span class="nav_divider">/</span>
			<a href="//www.adobe.com/privacy/cookies.html">
				<span class="localize_text" data-localize-key="footer_cookies" data-localize-default-text="Cookies">Cookies</span>
			</a>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'st-footer',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.footer {
		display: table;
		background-color: #3a3636;
		color: #999;
		padding: 15px;
		margin: 0;
		border-top: solid 1px rgba(255, 255, 255, .2);
		font-size: 14px;
		width: 100%;
		box-sizing: border-box;
	}

	.footer * {
		opacity: 0.8;
	}

	.footer:hover * {
		opacity: 1;
	}

	.copyright {
		margin-right: 0.5rem;
		text-align: left;
	}

	.footer .nav_links {
		display: table-cell;
		height: 44px;
		vertical-align: middle;
		text-align: right;
	}

	.footer .nav_divider {
		margin: 0 .3rem;
	}

	.footer a {
		color: #ffffff;
		text-decoration: none;
	}

	.footer a:hover {
		color: #9ce;
	}
</style>
