<?php
/*
 *	Trace Checkup Helper
 *	By AbsoluteDouble | https://absolutedouble.co.uk
 *
 *	Returns server side data to aid with browser privacy checkup
 *	Can be hosted on any domain, contains 1st and 3rd party functions
*/

if (!empty($_GET["testname"])){
	
	// Return user's HTTP user agent
	if ($_GET["testname"] === "UserAgent") {
		
		if (empty($_SERVER["HTTP_USER_AGENT"])){
			die("NotSet");
		} else {
			die($_SERVER["HTTP_USER_AGENT"]);
		}
		
	}
	
	// Return user's HTTP referer header
	if ($_GET["testname"] === "Referer") {
		
		if(isset($_SERVER['HTTP_REFERER'])) {
			die($_SERVER["HTTP_REFERER"]);
		} else {
			die();
		}
		
	}
	
	// Return Google headers
	if ($_GET["testname"] === "GoogleHeader") {
		
		$returnObj = array(
			"chromeVariations" => (!isset($_SERVER["HTTP_X_CHROME_VARIATIONS"]) || empty($_SERVER["HTTP_X_CHROME_VARIATIONS"])) ? true : false,
			"chromeConnected" => (!isset($_SERVER["HTTP_X_CHROME_CONNECTED"]) || empty($_SERVER["HTTP_X_CHROME_CONNECTED"])) ? true : false,
			"clientData" => (!isset($_SERVER["HTTP_X_CLIENT_DATA"]) || empty($_SERVER["HTTP_X_CLIENT_DATA"])) ? true : false,
			"chromeUma" => (!isset($_SERVER["HTTP_X_CHROME_UMA_ENABLED"]) || empty($_SERVER["HTTP_X_CHROME_UMA_ENABLED"])) ? true : false,
		);
		
		die(json_encode($returnObj));
		
	}
	
	// Return an etag
	if ($_GET["testname"] === "eTag"){
		
		header("ETag: TestTag");
		die("Etag test");
		
	}
	
	// Test prebrowsing...
	if ($_GET["testname"] == "pb"){
		
		$h = "localhost";
		if ($_SERVER["HTTP_HOST"] !== "localhost"){
			$h = "https://absolutedouble.co.uk/trace/";
		}
		setcookie("TraceCheckHTMLPrebrowse",time(),(time()+20),"/",$h,false,false);
		die();
		
	}

	// Test
	if ($_GET["testname"] == "pn"){
		
		die();
		
	} 

	// A test page for Hyperlink Auditing to open
	if ($_GET["testname"] === "HyperlinkAudit") {
		
		die("This is a Trace Test Page which should automatically close.<script type='text/javascript'>window.close();</script>");
		
	}
	
}

// Test Hyperlink Auditing
if ($_SERVER["REQUEST_METHOD"] == "POST"){
	$h = "localhost";
	if ($_SERVER["HTTP_HOST"] !== "localhost"){
		$h = "https://absolutedouble.co.uk/trace/";
	}
	setcookie("TraceCheckHyperlinkAudit",time(),(time()+20),"/",$h,false,false);
	die();
}

?>