<?php
	set_include_path($_SERVER['DOCUMENT_ROOT'] . '/includes');
	$primary = 2;
	include('header.php');
?>

<div id="main" role="document">

	<section class="container-fluid grid">
		<!-- Breadcrumbs -->
		<ul class="breadcrumbs">
			<li><a href="/">Home</a></li>
			<li class="last">Standard Content</li>
		</ul>
		<!-- Breadcrumbs -->

		<h2>Standard Column Grid</h2>

		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>
		<div class="col-1">
			<p>.col-1</p>
		</div>

		<div class="col-2">
			<p>.col-2</p>
		</div>
		<div class="col-2">
			<p>.col-2</p>
		</div>
		<div class="col-2">
			<p>.col-2</p>
		</div>
		<div class="col-2">
			<p>.col-2</p>
		</div>
		<div class="col-2">
			<p>.col-2</p>
		</div>
		<div class="col-2">
			<p>.col-2</p>
		</div>

		<div class="col-3">
			<p>.col-3</p>
		</div>
		<div class="col-3">
			<p>.col-3</p>
		</div>
		<div class="col-3">
			<p>.col-3</p>
		</div>
		<div class="col-3">
			<p>.col-3</p>
		</div>

		<div class="col-4">
			<p>.col-4</p>
		</div>
		<div class="col-4">
			<p>.col-4</p>
		</div>
		<div class="col-4">
			<p>.col-4</p>
		</div>

		<div class="col-6">
			<p>.col-6</p>
		</div>
		<div class="col-6">
			<p>.col-6</p>
		</div>

		<div class="col-12">
			<p>.col-12</p>
		</div>
	</section>

	<section class="container-fluid grid">
		<h2>Nested Column Grid</h2>

		<div class="col-6">
			<p>Parent: .col-6</p>

			<div class="nested-grid">
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
			</div>
		</div>

		<div class="col-6">
			<p>Parent: .col-6</p>

			<div class="nested-grid">
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
				<div class="col-4">
					<p>Child: .col-4</p>
				</div>
			</div>
		</div>
	</section>

</div>

<?php include('footer.php'); ?>

