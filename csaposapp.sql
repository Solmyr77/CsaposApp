-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2024 at 05:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csaposapp`
--
CREATE DATABASE IF NOT EXISTS `csaposapp` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `csaposapp`;

-- --------------------------------------------------------

--
-- Table structure for table `business_hours`
--

CREATE TABLE `business_hours` (
  `id` char(36) NOT NULL,
  `monday_open` time NOT NULL,
  `tuesday_open` time NOT NULL,
  `wednesday_open` time NOT NULL,
  `thursday_open` time NOT NULL,
  `friday_open` time NOT NULL,
  `saturday_open` time NOT NULL,
  `sunday_open` time NOT NULL,
  `monday_close` time NOT NULL,
  `tuesday_close` time NOT NULL,
  `wednesday_close` time NOT NULL,
  `thursday_close` time NOT NULL,
  `friday_close` time NOT NULL,
  `saturday_close` time NOT NULL,
  `sunday_close` time NOT NULL,
  `location_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` char(36) NOT NULL,
  `location_id` char(36) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `timefrom` datetime NOT NULL,
  `timeto` datetime NOT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance`
--

CREATE TABLE `event_attendance` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `event_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `number_of_tables` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `is_highlighted` tinyint(1) NOT NULL DEFAULT 0,
  `is_open` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `description`, `capacity`, `number_of_tables`, `rating`, `is_highlighted`, `is_open`, `created_at`, `img_url`) VALUES
('5ecdf8ff-8bf5-4cc1-98eb-c8af87faf4cd', 'City Pub', 'Egy kocsma a város szívében', 80, 16, -1, 0, 1, '2024-12-26 03:20:59', 'string'),
('9c458b82-7eb9-4fc9-a198-784245d13425', 'Sörpatika', 'Egy kulturáltabb kocsma a városban', 60, 12, -1, 0, 1, '2024-12-26 03:21:10', 'string'),
('c6276e02-67f8-45e1-ba7a-6271a93bea02', 'Alt lány hely', 'Mi mást kell mondani?', 20, 4, -1, 0, 1, '2024-12-26 03:21:45', 'string'),
('cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Félidő Söröző', 'Egy csendes kocsma egy csendes faluban', 40, 8, -1, 0, 1, '2024-12-26 03:20:38', 'string');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `table_id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `order_status` enum('pending','accepted','completed','paid','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `discount_percentage` int(11) NOT NULL DEFAULT 0,
  `stock_quantity` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 0,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `location_id`, `name`, `category`, `price`, `discount_percentage`, `stock_quantity`, `is_active`, `img_url`) VALUES
('875695ab-a760-486a-a801-9b052c8738b7', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Ez egy teszt termék', 'drink', 1000, 0, 10, 1, 'drink/875695ab-a760-486a-a801-9b052c8738b7.webp'),
('ac107756-f63c-4538-b4cc-91fc0cad6d82', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Finom ital', 'drink', 2660, 0, 24, 1, 'drink/ac107756-f63c-4538-b4cc-91fc0cad6d82.webp'),
('c5d2b92e-c78f-4bf0-8504-154f033a8898', '5ecdf8ff-8bf5-4cc1-98eb-c8af87faf4cd', 'Finom burger', 'food', 1299, 0, 100, 1, 'food/c5d2b92e-c78f-4bf0-8504-154f033a8898.webp');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` char(36) NOT NULL,
  `number` int(11) NOT NULL,
  `capacity` tinyint(4) NOT NULL,
  `is_booked` tinyint(1) NOT NULL,
  `location_id` char(36) NOT NULL,
  `booker_id` char(36) NOT NULL,
  `booked_from` datetime NOT NULL,
  `booked_to` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `table_guests`
--

CREATE TABLE `table_guests` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `table_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `legal_name` varchar(50) NOT NULL,
  `birth_date` date NOT NULL,
  `role` enum('guest','waiter','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `salt`, `legal_name`, `birth_date`, `role`, `created_at`, `img_url`) VALUES
('58f00932-8e85-4b6c-8bd2-89f48ebda754', 'mintajanko', 'uEaazwYbZ4A1cN0rBQrlClKw9GECRJykExEK6NlFTxY=', 'pOoGuecy/d4/aekh2Rq2Iw==', 'Minta János', '2024-12-26', 'guest', '2024-12-26 03:09:25', 'string');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `business_hours`
--
ALTER TABLE `business_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `booker_id` (`booker_id`);

--
-- Indexes for table `table_guests`
--
ALTER TABLE `table_guests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `table_id` (`table_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `business_hours`
--
ALTER TABLE `business_hours`
  ADD CONSTRAINT `business_hours_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD CONSTRAINT `event_attendance_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `event_attendance_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`booker_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tables_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `table_guests`
--
ALTER TABLE `table_guests`
  ADD CONSTRAINT `table_guests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `table_guests_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
