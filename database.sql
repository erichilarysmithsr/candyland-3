-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Oct 02, 2014 at 04:00 PM
-- Server version: 5.5.34
-- PHP Version: 5.5.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `steven`
--

-- --------------------------------------------------------

--
-- Table structure for table `Bots`
--

CREATE TABLE `Bots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `queries` text NOT NULL,
  `runs` int(11) DEFAULT NULL,
  `idle` int(11) DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `Bots`
--

INSERT INTO `Bots` (`id`, `name`, `target`, `queries`, `runs`, `idle`, `active`, `createdAt`, `updatedAt`) VALUES
(1, 'Dane Bot', 'http://danecando.com', 'web dev, node.js', 1, 16, 0, '2014-10-01 15:55:48', '2014-10-01 17:34:19'),
(2, 'FTL SEO', 'http://fortlauderdale-seo.com', 'fort lauderdale seo, seo fort lauderdale bricks & mortar', 1, 16, 0, '2014-10-01 17:36:53', '2014-10-01 18:49:36');
