<!DOCTYPE HTML>
<html lang="en">
	<head>
		<!-- Meta data -->
		<title>Trace | Browser Privacy</title>
		
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		
		<meta name="theme-color" content="#c6838f" />
		<meta name="author" content="Jake Mcneill" />
		<meta name="description" content="Test your web browser to see how well it protects you against modern tracking techniques." />
		
		<meta property="og:title" content="Trace | Browser Privacy" />
		
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		
		<link rel="stylesheet" href="styles.css" type="text/css" />
	</head>
	<body>
	
		<div id="overlay_message">
			<div id="overlay_cont">
				<span id="overlay_close">&times;</span>
				<div id="drop_message">
					<h1>Your Browser Test Results</h1>
					<span>Test not taken</span>
				</div>
			</div>
		</div>
		
		<div id="page">
			<div id="title">
				<h1>Trace | Browser Privacy</h1>
			</div>
			<div id="content">
				<div id="intro">
					This is a beta version of the Trace Browser Privacy Tool, 
					source code is available on <a href='https://github.com/jake-cryptic/'>GitHub</a>
				</div>
				<div id="test"></div>
			</div>
		</div>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.min.js" integrity="sha256-9Nt2r+tJnSd2A2CRUvnjgsD+ES1ExvjbjBNqidm9doI=" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
		<script type="text/javascript" src="checkup.js"></script>
	</body>
</html>