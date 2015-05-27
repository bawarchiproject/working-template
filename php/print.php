<?php
	$url = 'http://freehtmltopdf.com';
	$data = array(  'convert' => '',
			'html' => '<html><head><title></title><style type="text/css">table { border: 1px solid #717171; font: 13px, sans-serif; text-align: left; width: 100%; }table thead { background: #9d9d9d; }table th, table td { padding: 5px;}table th a, table td a { color: #ea2742; font-size: 13px; }table tr:nth-child(even) { background: #d3d3d3; }</style></head><body><div class="standard-content">'. $_GET["obj"] .'</div></body></html>',
			'baseurl' => 'http://www.foobar.com');

	// use key 'http' even if you send the request to https://...
	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'GET',
			'content' => http_build_query($data),
		),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

	// set the pdf data as download content:
	header('Content-type: application/pdf');
	header('Content-Disposition: attachment; filename="table.pdf"');
	var_dump($result);
?>