<?php
    set_include_path($_SERVER['DOCUMENT_ROOT'] . '/includes');
    $primary = 0;
    include('header.php');
?>

<main id="main" role="document">
    <div class="container-fluid">
        <div class="col-3 alignCenter">
            <button class="btn icon-hamburger icon-ham-cross">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M4.939,9.875h30.123"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M5,20h30.122"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M5,30.4h30.122"/>
                </svg>
            </button>
            <br/>
            <p>Typical Hamburger Icon</p>
        </div>

        <div class="col-3 alignCenter">
            <button class="btn icon-hamburger icon-ham-cross-alt">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M4.939,9.875h30.123"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M5,20h30.122"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M5,30.4h30.122"/>
                </svg>
            </button>
            <br/>
            <p>Hamburger Cross</p>
        </div>

        <div class="col-3 alignCenter">
            <button class="btn icon-magnify">
                <svg version="1.0" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="none" stroke="#9D9D9D" stroke-width="3" stroke-miterlimit="10" d="M27.721,27.345L35.375,35 M18.686,6.174
                        c-6.911,0-12.513,5.602-12.513,12.514c0,6.912,5.602,12.512,12.513,12.512c6.913,0,12.515-5.6,12.515-12.512
                        C31.2,11.776,25.599,6.174,18.686,6.174z"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="3" stroke-miterlimit="10" d="M26.187,18.687h-15"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="3" stroke-miterlimit="10" d="M18.686,11.185v15"/>
                </svg>
            </button>
            <br/>
            <p>Magnifying Glass</p>
        </div>

        <div class="col-3 alignCenter">
            <button class="btn icon-plusminus-toggle">
                <svg version="1.0" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M20,4.875V35"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="5" stroke-miterlimit="10" d="M35.063,19.938H4.938"/>
                </svg>
            </button>
            <br/>
            <p>Toggle Plus Minus</p>
        </div>

        <div class="col-3 alignCenter">
            <button class="btn icon-arrow-toggle">
                <svg version="1.0" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                    <path fill="none" stroke="#9D9D9D" stroke-width="3" stroke-miterlimit="10" d="M18.99,27.967l16.132-16.132"/>
                    <path fill="none" stroke="#9D9D9D" stroke-width="3" stroke-miterlimit="10" d="M21.009,27.967L4.877,11.835"/>
                </svg>
            </button>
            <br/>
            <p>Expand / Collapse Arrows</p>
        </div>
    </div>
</main>

<?php include('footer.php'); ?>