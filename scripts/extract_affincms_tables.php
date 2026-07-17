#!/usr/bin/env php
<?php

/**
 * Stream-extract selected tables from a large AffinCMS mysqldump into a smaller SQL file.
 *
 * Usage:
 *   php extract_affincms_tables.php /path/to/dump.sql /path/to/out.sql
 */

$in = $argv[1] ?? null;
$out = $argv[2] ?? null;

if (! $in || ! $out) {
    fwrite(STDERR, "Usage: php extract_affincms_tables.php <input.sql> <output.sql>\n");
    exit(1);
}

$tables = [
    'pagebuilder__pages',
    'pagebuilder__page_translations',
    'discover_promotions',
    'a1addin_promotions',
    'a1addin_announcements',
    'affin_always_announcement_lists',
    'articles',
    'internal_news',
    'internal_annoucements',
    'internal_promotions',
];

$wanted = array_fill_keys($tables, true);
$fhIn = fopen($in, 'rb');
$fhOut = fopen($out, 'wb');

if (! $fhIn || ! $fhOut) {
    fwrite(STDERR, "Cannot open files\n");
    exit(1);
}

fwrite($fhOut, "-- Extracted AffinCMS tables for PageBuilder V2 migration\n");
fwrite($fhOut, "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n");

$capture = false;
$current = null;
$written = 0;

while (($line = fgets($fhIn)) !== false) {
    if (preg_match('/^DROP TABLE IF EXISTS `([^`]+)`/', $line, $m)
        || preg_match('/^CREATE TABLE `([^`]+)`/', $line, $m)
        || preg_match('/^LOCK TABLES `([^`]+)`/', $line, $m)
        || preg_match('/^INSERT INTO `([^`]+)`/', $line, $m)
    ) {
        $current = $m[1];
        $capture = isset($wanted[$current]);
    }

    if (preg_match('/^-- Table structure for table `([^`]+)`/', $line, $m)
        || preg_match('/^-- Dumping data for table `([^`]+)`/', $line, $m)
    ) {
        $current = $m[1];
        $capture = isset($wanted[$current]);
    }

    if ($capture) {
        fwrite($fhOut, $line);
        $written++;
        if (str_starts_with($line, 'UNLOCK TABLES')) {
            fwrite($fhOut, "\n");
            $capture = false;
        }
    }
}

fwrite($fhOut, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($fhIn);
fclose($fhOut);

echo "Wrote {$out} ({$written} lines kept)\n";
