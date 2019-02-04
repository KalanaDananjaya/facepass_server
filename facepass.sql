-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 04, 2019 at 02:15 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facepass`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `uid` varchar(50) NOT NULL,
  `webid` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `email` varchar(30) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `phone` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`email`, `firstName`, `uid`, `phone`) VALUES
('kalana.16@cse.mrt.ac.lk', 'Kalana', '098fcc8d-454e-4f51-8156-f38422b7d4bb', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '0d8c95d9-e6e7-4212-9b73-458932b38a97', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '0dc16310-a1b5-42c1-9104-e73e3ff71fd3', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '123fdeb1-d8df-4ca7-a19f-9c0d5621954c', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '1846f3f5-9c0c-4f60-9968-b8d866449eed', 0),
('kalana.16@cse.mrt.ac.lk', 'kalana', '19d92cf3-2624-4bed-96c1-6447bd25afd2', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '29c23c3a-a0c4-49ea-a70c-fe0e8610e377', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '314980f6-f8eb-494c-9fb7-070a51c3ed91', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '3765b2e0-f95c-4b35-b1f7-c56c4e7c68af', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '4dd121a8-62bb-49ad-b976-cba656078927', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '6483a5f3-a2a3-4fd2-8561-574579c528d1', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '6c4e7679-be90-4a61-83dc-641c67296109', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '756bb6f0-5003-404e-bb03-48dd95c1d405', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '84b978d0-e80c-44d8-97ec-07f9225d4b9d', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', '9a589361-bbbe-4f70-9187-88378d9f608e', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'a3faee94-c861-46d4-913f-2878f74ba44f', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'b175477c-2fe7-401d-8427-0f727408575a', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'b9a5a40f-1d00-4bf1-a653-0511b44941ad', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'c7e3ad4a-38c6-4407-8592-f7c736c1b488', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'd1ef45f1-4c9c-4d80-bae8-3542717f9e6b', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'd2837264-5fac-4a81-bdaf-7724f9a0c05d', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'df6a43b7-fb20-4414-b296-36f62d71bff1', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'f61d2cd6-a037-4d96-ab67-1deea8fdbb2c', 0),
('kalana.16@cse.mrt.ac.lk', 'Kalana', 'fad0404b-e4df-4210-9c1e-c5f944580dfd', 0);

-- --------------------------------------------------------

--
-- Table structure for table `faces`
--

CREATE TABLE `faces` (
  `uid` varchar(50) NOT NULL,
  `face` blob NOT NULL,
  `vector` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `login_details`
--

CREATE TABLE `login_details` (
  `uid` varchar(50) NOT NULL,
  `webid` varchar(30) NOT NULL,
  `login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logout` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `website`
--

CREATE TABLE `website` (
  `webid` varchar(30) NOT NULL,
  `url` varchar(50) NOT NULL,
  `sitename` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `faces`
--
ALTER TABLE `faces`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `login_details`
--
ALTER TABLE `login_details`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `website`
--
ALTER TABLE `website`
  ADD PRIMARY KEY (`webid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
