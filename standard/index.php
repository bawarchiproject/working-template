<?php
	set_include_path($_SERVER['DOCUMENT_ROOT'] . '/includes');
	$primary = 1;
	include('header.php');
?>

<main id="main" role="document">

	<!-- Hero Banner -->
	<header class="standard-banner backstretch" data-background="/assets/bawarchi/images/background.jpg">
		<div class="container-fluid">
			<h2>Title</h2>
		</div>
	</header>
	<!-- Hero Banner -->

	<!-- Content Area -->
	<section class="container-fluid">

		<article class="col-12">

			<!-- Breadcrumbs -->
			<ul class="breadcrumbs">
				<li><a href="/">Home</a></li>
				<li class="last">Standard Content</li>
			</ul>
			<!-- Breadcrumbs -->

			<h1>Header 1</h1>
		    <h2>Header 2</h2>
		    <h3>Header 3</h3>
		    <h4>Header 4</h4>
		    <h5>Header 5</h5>
		    <h6>Header 6</h6>

		    <h1>Content Tester</h1>

		    <div class="intro">
		        <p>This is an intro paragraph. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
		        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
		    </div>

		    <p>
		        <img class="pull-left lazy" data-original="http://placehold.it/390x170/" alt="" >This is a paragraph with left justified image. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
		        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
		    </p>
		    <p>
		        <img class="pull-right lazy" data-original="http://placehold.it/390x170/" alt="" >This is a paragraph with left justified image. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
		        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
		    </p>
		    <img class="lazy" data-original="http://placehold.it/390x170/" alt="">

		    <p>This is a paragraph with image before it. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
		    <!-- Test content starts here -->

		    <p>Test contents from here, including the line below. Normally users should only enter starting heading 2(h2) to maintaing document outline integrity. However they can occassionaly use h1, but semantically, the content will be at same level as this page.</p>
		    <hr>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>

		    <h2>This is 2nd level heading(h2)</h2>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>

		    <h3>This is 3rd level heading(h3)</h3>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>

		    <h4>This is 4th level heading(h4)</h4>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>
		    <p>This is a test paragraph.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. </p>

		    <hr>

		    <h2>Basic block level elements</h2>

		    <p>This is a normal paragraph (<code>p</code> element). To add some length to it, let us mention that this page was primarily written for testing the effect of <strong>user style sheets</strong>. You can use it for various other purposes as well, like just checking how your browser displays various HTML elements.</p>
		    <p>This is another paragraph. I think it needs to be added that the set of elements tested is not exhaustive in any sense. I have selected those elements for which it can make sense to write user style sheet rules, in my opionion.</p>

		    <div>This is a <code>div</code> element. Authors may use such elements instead of paragraph markup for various reasons. (End of <code>div</code>.). It has no semantic meaning. Normally not used by users.</div>

		    <blockquote><p>This is a block quotation containing a single paragraph. Well, not quite, since this is not <em>really</em> quoted text, but I hope you understand the point. After all, this page does not use HTML markup very normally anyway.</p></blockquote>

		    <p>The following contains address information about the author, in an <code>address</code> element.</p>

		    <address>
		        <a id="author-credits" href="/404.html" lang="en" hreflang="en">John Doe</a>,
		        <a href="john-doe@readingroom.com.sg">johndoe@readingroom.com.sg</a>
		    </address>

		    <h2>Lists</h2>

		    <p>This is a paragraph before an <strong>unnumbered</strong> list (<code>ul</code>). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g. as a "list header".</p>
		    <ul>
		        <li> One.</li>
		        <li> Two.</li>
		        <li> Three. Well, probably this list item should be longer. Note that for short items lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li>
		        <li> Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li>
		    </ul>


		    <p>This is a paragraph before a <strong>numbered</strong> list (<code>ol</code>). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g. as a "list header".</p>
		    <ol>
		        <li> One.</li>
		        <li> Two.</li>
		        <li> Three. Well, probably this list item should be longer. Note that if items are short, lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li>
		        <li> Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li>
		    </ol>

		    <p>This is a paragraph before a <strong>definition</strong> list (<code>dl</code>). In principle, such a list should consist of <em>terms</em> and associated  definitions. But many authors use <code>dl</code> elements for fancy "layout" things. Usually the effect is not <em>too</em> bad, if you design user style sheet rules for <code>dl</code> which are suitable for real definition lists.</p>

		    <dl>
		        <dt> recursion </dt>
		        <dd> see recursion</dd>
		        <dt> recursion, indirect</dt>
		        <dd> see indirect recursion</dd>
		        <dt> indirect recursion</dt>
		        <dd> see recursion, indirect</dd>
		        <dt> term</dt>
		        <dd> a word or other expression taken into specific use in a well-defined meaning, which is often defined rather rigorously, even formally, and may differ quite a lot from an everyday meaning</dd>
		    </dl>

		    <h2>Nested Lists</h2>

		    <ol>
		        <li> One.</li>
		        <li> Two.</li>
		        <li> Three.
		            <ul>
		                <li> Three - One.</li>
		                <li> Three - Two.
		                    <ul>
		                        <li> Three - Three - One.</li>
		                        <li> Three - Three - Two.</li>
		                    </ul>
		                </li>
		                <li> Three - Three.</li>
		            </ul>
		        </li>
		        <li> Four.</li>
		    </ol>

		    <h2>Table</h2>
		    <table class="printableTable" data-title="Sample Data Table">
		        <tbody>
		            <tr>
		                <th>Table Header 1</th>
		                <th>Table Header 2</th>
		                <th>Table Header 3</th>
		                <th>Table Header 4</th>
		                <th>Table Header 5</th>
		                <th>Table Header 6</th>
		                <th>Table Header 7</th>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr class="even">
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		            <tr>
		                <td>Aenean ut metus non mauris fermentum congue.</td>
		                <td>Proin vel augue eu dolor aliquam sagittis eu vitae sem.</td>
		                <td>Morbi et nibh non turpis placerat pharetra nec eu elit.</td>
		                <td>Curabitur sed lacus fringilla, molestie mi vel, pellentesque elit.</td>
		                <td>Fusce vestibulum justo quis volutpat dapibus.</td>
		                <td>Nullam ultricies nulla id ligula facilisis aliquam.</td>
		                <td>Nulla luctus risus non tellus pulvinar elementum vel ut libero.</td>
		            </tr>
		        </tbody>
		    </table>

		    <h2>Text-level markup</h2>

		    <ul>
		        <li>
		            <abbr title="Cascading Style Sheets">CSS</abbr> (an abbreviation;
		            <code>abbr</code> markup used)
		        </li>
		        <li> <strong>strong text</strong> (<code>strong</code> markup used - bolding with semantics</li>
		        <li> <b>bolded</b> (<code>b</code> markup used - just bolding with unspecified semantics)</li>
		        <li> <cite>Origin of Species</cite> (a book title, movie etc. Generally a piece of work. No persons name; <code>cite</code> markup used) </li>
		        <li> <code>a[i] = b[i] + c[i);</code> (computer code; <code>code</code> markup used)</li>
		        <li> here we have some <del>deleted</del> text (<code>del</code> markup used)</li>
		        <li> an <dfn>octet</dfn> is an entity consisting of eight bits (<code>dfn</code> markup used for the term being defined)</li>
		        <li> this is <em>very</em> simple (<code>em</code> markup used for emphasizing a word) </li>
		        <li> <i lang="la">Homo sapiens</i> (should appear in italics;  <code>i</code> markup used) </li>
		        <li> <em>Homo sapiens</em> (should appear in italics;  <code>em</code> markup used) </li>
		        <li> here we have some <ins>inserted</ins> text (<code>ins</code> markup used) </li>
		        <li> type <kbd>yes</kbd> when prompted for an answer (<code>kbd</code> markup used for text indicating keyboard input) </li>
		        <li> <q>Hello!</q> (<code>q</code> markup used for quotation) </li>
		        <li> He said: <q>She said <q>Hello!</q></q> (a quotation inside a quotation) </li>
		        <li> you may get the message <samp>Core dumped</samp> at times (<code>samp</code> markup used for sample output) </li>
		        <li> <small>this is not that important</small> (<code>small</code> markup used) </li>
		        <li> <strike>overstruck</strike> (<code>strike</code> markup used; note: <code>s</code> is a nonstandard synonym for <code>strike</code>) </li>
		        <li> <del>overstruck</del> (<code>del</code> markup used; note: <code>s</code> is a nonstandard synonym for <code>strike</code>) </li>
		        <li> <strong>this is highlighted text</strong> (<code>strong</code>markup used)</li>
		        <li> In order to test how subscripts and superscripts (<code>sub</code> and <code>sup</code> markup) work inside running text, we need some dummy text around constructs like x<sub>1</sub> and H<sub>2</sub>O (where subscripts occur). So here is some fill so that you will (hopefully) see whether and how badly the subscripts and superscripts mess up vertical spacing between lines. Now superscripts: M<sup>lle</sup>, 1<sup>st</sup>, and then some mathematical notations: e<sup>x</sup>, sin<sup>2</sup> <i>x</i>, and some nested superscripts (exponents) too: e<sup>x<sup>2</sup></sup> and f(x)<sup>g(x)<sup>a+b+c</sup></sup> (where 2 and a+b+c should appear as exponents of exponents).</li>
		        <li> <u>underlined</u> text (<code>u</code> markup used)</li>
		        <li> the command <code>cat</code> <var>filename</var> displays the file specified by the <var>filename</var> (<code>var</code> markup used to indicate a word as a variable).</li>
		    </ul>

		    <p>Some of the elements tested above are typically displayed in a monospace font, often using the <em>same</em> presentation for all of them. This tests whether that is the case on your browser:</p>

		    <ul>
		        <li> <code>This is sample text inside code markup</code></li>
		        <li> <kbd>This is sample text inside kbd markup</kbd></li>
		        <li> <samp>This is sample text inside samp markup</samp></li>
		    </ul>
		    <h2>Links</h2>
		    <ul>
		        <li> <a href="../index.html">main page</a></li>
		        <li> <a href="http://www.unicode.org/versions/Unicode4.0.0/ch06.pdf" title="Writing Systems and Punctuation" type="application/pdf" class="external" target="_blank">Unicode Standard, chapter&nbsp;6</a></li>
		    </ul>

		    <p>This is a text paragraph that contains some inline links. Generally, inline links (as opposite to e.g. links lists) are problematic from the <a href="http://www.useit.com" class="external" target="_blank">usability</a> perspective, but they may have use as "incidental", less relevant links. See the document <cite><a href="404.html">Links Want To Be Links</a></cite>.</p>
	    </article>
	</section>
	<!-- Content Area -->

</main>

<?php include('footer.php'); ?>

