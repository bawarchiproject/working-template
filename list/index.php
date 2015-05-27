<?php
    set_include_path($_SERVER['DOCUMENT_ROOT'] . '/includes');
    $primary = 0;
    include('header.php');
?>

<style type="text/css">
    #main { padding: 20px 0; }
    table { border: 1px solid #717171; font-size: 13px; text-align: left; width: 100%; }
    table thead { background: #9d9d9d; }
    table th, table td { padding: 5px; width: 50%;}
    table th a, table td a { color: #ea2742; font-size: 13px; }
    /*table th:first-child, td:first-child { width: 200px; }*/
    table tr:nth-child(even) { background: #d3d3d3; }

</style>

<div id="main" role="main ">
    <div class="container" style="padding: 20px 0;">
        <table>
             <thead>
                <tr>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th><a href="/" target="_blank">Home</a></th>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<?php include('footer.php'); ?>
