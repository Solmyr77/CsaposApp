-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 09, 2025 at 11:17 AM
-- Server version: 5.7.44
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `csaposdb`
--
CREATE DATABASE IF NOT EXISTS `csaposdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `csaposdb`;

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `criteria` varchar(255) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT '0',
  `type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `business_hours`
--

INSERT INTO `business_hours` (`id`, `monday_open`, `tuesday_open`, `wednesday_open`, `thursday_open`, `friday_open`, `saturday_open`, `sunday_open`, `monday_close`, `tuesday_close`, `wednesday_close`, `thursday_close`, `friday_close`, `saturday_close`, `sunday_close`, `location_id`, `name`, `created_at`, `updated_at`) VALUES
('4fd3b612-f176-11ef-9ae8-0242ac150005', '08:00:00', '10:00:00', '07:00:00', '07:00:00', '10:00:00', '10:00:00', '10:00:00', '23:00:00', '23:00:00', '23:00:00', '23:00:00', '23:00:00', '23:00:00', '23:00:00', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Normál', '2025-02-22 23:39:51', '2025-04-09 05:40:53'),
('68431819-066f-11f0-8ddd-0242ac120003', '10:00:00', '10:00:00', '10:00:00', '10:00:00', '10:00:00', '10:00:00', '12:00:00', '23:00:00', '23:00:00', '23:00:00', '23:00:00', '02:00:00', '02:00:00', '22:00:00', '2d73302e-028c-4136-bb20-956881966534', 'Normál', '2025-03-21 16:13:20', '2025-03-21 16:13:56');

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
  `img_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `location_id`, `name`, `description`, `timefrom`, `timeto`, `img_url`, `created_at`, `updated_at`) VALUES
('75d68b04-7a4d-4354-bd60-ff75494080a7', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Azahriah a Félidőben!', 'Legkomolyabb kocsmakoncert valaha!', '2025-05-30 20:00:00', '2025-05-30 23:00:00', '75d68b04-7a4d-4354-bd60-ff75494080a7_99152246-c5a1-4926-97e1-3ff7a5e403f6.webp', '2025-04-09 08:16:31', '2025-04-09 10:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance`
--

CREATE TABLE `event_attendance` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `event_id` char(36) DEFAULT NULL,
  `status` enum('accepted','rejected') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_attendance`
--

INSERT INTO `event_attendance` (`id`, `user_id`, `event_id`, `status`, `created_at`, `updated_at`) VALUES
('e4722b61-1e5b-4c5b-8673-79e92eccf9d6', '28c9767c-cc7c-4948-836a-512a749df074', '75d68b04-7a4d-4354-bd60-ff75494080a7', 'accepted', '2025-04-09 10:17:45', '2025-04-09 10:18:01');

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE `friendships` (
  `id` char(36) NOT NULL,
  `user_id1` char(36) NOT NULL,
  `user_id2` char(36) NOT NULL,
  `status` enum('pending','accepted','rejected','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `friendships`
--

INSERT INTO `friendships` (`id`, `user_id1`, `user_id2`, `status`, `created_at`, `updated_at`) VALUES
('09c16e04-81da-421e-84fc-d931cf7d1c73', '28c9767c-cc7c-4948-836a-512a749df074', '4c38c82e-a398-40f3-b070-0a1c42798c9f', 'pending', '2025-03-12 12:00:26', '2025-03-12 13:00:26'),
('1318f76c-ccb1-426e-9791-5e69e768d97d', '28c9767c-cc7c-4948-836a-512a749df074', '9eaa68e2-25fc-4e9a-a1a8-2f8cb7e82d11', 'accepted', '2025-03-16 20:22:13', '2025-03-16 21:23:35'),
('27a7513a-e667-4e01-b6fe-ac722d56badc', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '59b0053a-dfbb-477d-b01d-17c486ed8719', 'accepted', '2025-03-21 11:11:56', '2025-03-21 12:12:13'),
('30c7535c-134e-4425-85b2-97481f4bf500', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-02-25 09:07:17', '2025-02-25 10:08:43'),
('31beae9a-2d74-421a-8e68-a2e18b5385b7', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb', '9fbe5809-7b34-4f67-a114-99cedceb177a', 'pending', '2025-02-25 09:07:21', '2025-02-25 10:07:21'),
('362e98e4-94e1-45cd-aeb8-c60b0fce5905', '28c9767c-cc7c-4948-836a-512a749df074', 'bba54a66-7e71-4e14-98e0-8f435e0b2f7b', 'accepted', '2025-02-24 17:43:24', '2025-03-28 22:58:53'),
('4250d839-0eee-43fd-a9e7-d4a99f7a69ce', '60d6b130-dd78-401d-ae22-ff910d2de993', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-02-28 12:17:58', '2025-02-28 13:23:00'),
('49c74f6a-d85b-4b7c-a512-bc69d886392d', '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', 'accepted', '2025-03-19 11:29:01', '2025-03-19 12:29:10'),
('50647193-137e-4de2-ab66-31344b93c606', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb', 'e4171b14-4e95-44f7-9228-f6aaf3630143', 'accepted', '2025-02-25 09:07:39', '2025-02-25 10:10:15'),
('53a3f6ff-98d7-4dc6-832f-1777dd0e4a3e', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '60d6b130-dd78-401d-ae22-ff910d2de993', 'accepted', '2025-03-09 09:34:39', '2025-03-11 17:09:35'),
('54cdd1c2-53a7-4c7f-a3be-1bb7a52dceb3', '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-04-03 10:24:03', '2025-04-03 12:25:28'),
('59c15769-72cc-42bb-a669-3326bd4c5122', '1e977aa5-ddca-4874-91e3-35520b593a68', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', 'accepted', '2025-03-21 18:34:11', '2025-03-21 19:34:29'),
('5b606040-325c-4cfa-8830-6cb9aac79984', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', 'bba54a66-7e71-4e14-98e0-8f435e0b2f7b', 'accepted', '2025-03-28 21:58:33', '2025-03-28 22:58:51'),
('5f48ac10-8b25-450f-a86e-a5909a10f5fb', '28c9767c-cc7c-4948-836a-512a749df074', 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', 'rejected', '2025-03-22 17:25:08', '2025-03-22 18:25:53'),
('631a0667-beee-4b08-b98f-942d4ba01d0f', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb', '63617d3e-edff-4c33-a6cf-f86170d93161', 'accepted', '2025-02-25 09:07:30', '2025-03-04 20:46:47'),
('63baf6ba-78cf-4714-8416-a2db9481e786', '28c9767c-cc7c-4948-836a-512a749df074', '63617d3e-edff-4c33-a6cf-f86170d93161', 'accepted', '2025-02-24 09:47:37', '2025-02-24 10:47:54'),
('68b48456-ff19-448a-b7f3-a17f15e9e802', '3a018d16-c6ea-458c-8be7-a646fbd70b82', '60d6b130-dd78-401d-ae22-ff910d2de993', 'pending', '2025-03-28 18:30:50', '2025-03-28 19:30:49'),
('6c1944ff-2d2c-4555-9dde-5876fc37ef07', 'b49f053f-9d59-4359-b9f8-e00a50f5145f', '63617d3e-edff-4c33-a6cf-f86170d93161', 'accepted', '2025-02-24 09:50:18', '2025-02-24 10:50:29'),
('6e004d4e-66f5-490e-9c57-9f8cc6b5fdd2', '28c9767c-cc7c-4948-836a-512a749df074', '9fbe5809-7b34-4f67-a114-99cedceb177a', 'accepted', '2025-02-20 09:10:32', '2025-02-20 09:10:46'),
('6f4bb56b-5e6e-4e1f-819d-8ba922fe195d', '28c9767c-cc7c-4948-836a-512a749df074', 'bab61c73-ad3b-48c3-a6c6-47e19c3df87a', 'pending', '2025-02-26 12:32:16', '2025-02-26 13:32:16'),
('70133814-97d3-42c4-93d0-87122b2174a8', '59b0053a-dfbb-477d-b01d-17c486ed8719', '1e977aa5-ddca-4874-91e3-35520b593a68', 'accepted', '2025-03-21 18:40:06', '2025-03-21 19:40:56'),
('70342bb2-73f8-48fa-a738-0bbcfe068d68', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d', 'pending', '2025-03-18 19:06:31', '2025-03-18 20:06:31'),
('7b8bd3e4-e286-4f7f-813f-7217f2c4363f', '28c9767c-cc7c-4948-836a-512a749df074', '1fed351a-16ba-4d57-a7b5-39c46d280806', 'pending', '2025-03-12 11:59:42', '2025-03-12 12:59:41'),
('81d78ea1-5b68-442a-9095-25ab8eb401e8', '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '63617d3e-edff-4c33-a6cf-f86170d93161', 'accepted', '2025-04-03 10:25:34', '2025-04-03 12:26:49'),
('8bcd5b14-57ca-4286-b1a0-6e93aeb7e818', '28c9767c-cc7c-4948-836a-512a749df074', '372b441d-2456-4c88-9146-f26a79c238ed', 'pending', '2025-02-24 17:49:19', '2025-02-24 18:49:19'),
('8eddbfca-14e3-4748-9d57-7a3183045695', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', 'rejected', '2025-03-23 12:30:59', '2025-03-23 13:54:59'),
('a2208655-44f8-4f3f-9b28-415781391a28', '28c9767c-cc7c-4948-836a-512a749df074', '59b0053a-dfbb-477d-b01d-17c486ed8719', 'accepted', '2025-03-21 11:11:46', '2025-03-21 12:12:37'),
('a32d9ffc-e2f5-4b10-b3dc-5313abced4f9', 'e4171b14-4e95-44f7-9228-f6aaf3630143', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-02-25 09:05:50', '2025-02-25 10:05:55'),
('a4e85b74-3d53-4363-8c6a-84ecf0ad87f5', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb', '60d6b130-dd78-401d-ae22-ff910d2de993', 'accepted', '2025-02-25 09:07:18', '2025-02-26 13:29:24'),
('a5f991e5-c717-48dd-931e-e8b81f3371f8', '9045a756-2571-43a6-aa99-817c5c4eee25', '60d6b130-dd78-401d-ae22-ff910d2de993', 'accepted', '2025-03-07 15:00:35', '2025-03-07 16:02:21'),
('b3840ae5-d123-471d-89ef-d13a41a2b159', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-04-03 04:18:40', '2025-04-03 06:19:10'),
('b8d1b10d-947b-4be1-8f71-d3c46ab527b3', '63617d3e-edff-4c33-a6cf-f86170d93161', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', 'accepted', '2025-03-19 11:28:31', '2025-03-19 12:28:47'),
('b9b036b3-6cf6-4690-b901-abc582bbf194', '3b7d8f5f-f61f-4c93-b041-d38cc44f101b', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', 'accepted', '2025-03-20 10:42:17', '2025-03-20 11:42:59'),
('b9f4b0aa-848c-4a5d-a114-d56662a373fc', '28c9767c-cc7c-4948-836a-512a749df074', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', 'accepted', '2025-03-21 10:52:36', '2025-03-21 11:54:27'),
('be21d7a6-3a21-44eb-96f2-aecedb364a90', '730a8fcb-7165-4242-b794-f60f7f5bc869', 'c6ea640d-fa2b-4b23-bef2-b05baa25eba4', 'accepted', '2025-03-16 16:46:56', '2025-03-16 17:47:21'),
('c0918c4e-9f0b-4152-acf9-3a3e44d04eb1', '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-03-19 19:59:34', '2025-03-19 21:26:43'),
('ca546817-270c-4228-9e9e-a7e84d83990d', '1fed351a-16ba-4d57-a7b5-39c46d280806', '4c38c82e-a398-40f3-b070-0a1c42798c9f', 'accepted', '2025-03-10 09:44:36', '2025-03-10 10:45:11'),
('ef9aa4bc-ff36-4756-9337-004b4f13a866', '66e89804-31fe-4b3d-83bf-655cc5998265', '28c9767c-cc7c-4948-836a-512a749df074', 'accepted', '2025-03-16 14:14:38', '2025-03-16 15:14:48'),
('f05c7227-53da-40f9-a6e4-fdf722c25b45', '28c9767c-cc7c-4948-836a-512a749df074', '67d7581e-4569-4eaf-ba0d-fce71a94e120', 'pending', '2025-02-24 09:50:01', '2025-02-24 10:50:01'),
('fe1b1d53-b010-4045-9fff-b952a38d67cf', '28c9767c-cc7c-4948-836a-512a749df074', '9d59a117-ce83-4c29-a2d5-7360daab1c8a', 'accepted', '2025-03-25 09:48:33', '2025-03-25 10:48:43');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `address` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `number_of_tables` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `is_highlighted` tinyint(1) NOT NULL DEFAULT '0',
  `is_open` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `img_url` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `description`, `address`, `capacity`, `number_of_tables`, `rating`, `is_highlighted`, `is_open`, `created_at`, `img_url`, `updated_at`) VALUES
('2d73302e-028c-4136-bb20-956881966534', 'RED - Miskolc', 'Újra szól a hatlövetű!', 'Miskolc, Szemere Bertalan u. 2.', 100, 40, -1, 0, 1, '2025-03-21 07:16:55', '2d73302e-028c-4136-bb20-956881966534.webp', '2025-03-21 08:20:48'),
('509d0dc4-79b5-437c-ae0f-5f49e1f7d915', 'Intim Presszó', 'Adnak forrócsokit', 'Miskolc, Déryné u. 8, 3525 Hungary', 60, 12, -1, 0, 1, '2025-02-21 09:19:25', '509d0dc4-79b5-437c-ae0f-5f49e1f7d915.webp', '2025-02-21 13:02:54'),
('5ecdf8ff-8bf5-4cc1-98eb-c8af87faf4cd', 'City Pub', 'Egy kocsma a város szívében', '', 80, 16, -1, 0, 0, '2024-12-26 03:20:59', 'string', '2025-02-14 10:34:03'),
('9c458b82-7eb9-4fc9-a198-784245d13425', 'Sörpatika', 'Egy kulturáltabb kocsma a városban', '', 60, 12, -1, 0, 1, '2024-12-26 03:21:10', 'string', '2025-02-14 10:34:03'),
('af0ed771-1410-472f-a334-bef3f124ae5f', 'Ez egy teszt hely', 'Ez meg egy teszt leírás', '', 100, 10, -1, 0, 1, '2025-01-17 19:30:27', 'string', '2025-02-14 10:34:03'),
('c6276e02-67f8-45e1-ba7a-6271a93bea02', 'Alt lány hely', 'Mi mást kell mondani?', '', 20, 4, -1, 1, 1, '2024-12-26 03:21:45', 'string', '2025-02-14 10:34:03'),
('cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Félidő Söröző', 'Egy csendes kocsma egy csendes faluban', '3599 Sajószöged, Petőfi út 2.', 40, 8, 5, 1, 1, '2024-12-26 03:20:38', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a.webp', '2025-04-03 06:57:23');

-- --------------------------------------------------------

--
-- Table structure for table `location_ratings`
--

CREATE TABLE `location_ratings` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `location_id` char(36) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `location_ratings`
--

INSERT INTO `location_ratings` (`id`, `user_id`, `location_id`, `rating`) VALUES
('18c44472-3951-45bf-9f4a-393a971fc075', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 4),
('1fd4cf80-6b34-4668-a26b-0f9f6c4d8c62', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5),
('4a8f9eaf-ce6e-4cec-8cab-296dc30cd5c5', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 3),
('79311fcf-2c35-4e8c-a616-7fbebb055231', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5),
('abfb63da-b6ae-4218-990b-4d6e72dc9c62', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5),
('e67a6659-c5ae-4044-abcb-cb9b3de5c139', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5),
('f162a684-0a51-4464-8e73-85e921bccf6d', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5),
('f6ccb08e-922c-48c2-824f-5c4ec31ce36e', '28c9767c-cc7c-4948-836a-512a749df074', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 5);

--
-- Triggers `location_ratings`
--
DELIMITER $$
CREATE TRIGGER `update_location_rating` AFTER INSERT ON `location_ratings` FOR EACH ROW BEGIN
    UPDATE locations
    SET rating = (SELECT AVG(rating) FROM location_ratings WHERE location_id = NEW.location_id)
    WHERE id = NEW.location_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `manager_mapping`
--

CREATE TABLE `manager_mapping` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `manager_mapping`
--

INSERT INTO `manager_mapping` (`id`, `user_id`, `location_id`, `created_at`, `updated_at`) VALUES
('676d87f7-1e46-4677-a3bf-45c5cb0f93bb', '3890fc3f-42ce-432a-ac19-ad665f39a976', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-03-05 23:00:00', '2025-03-28 09:04:26');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `table_id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `order_status` enum('pending','accepted','completed','paid','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `table_booking_id` char(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `discount_percentage` int(11) NOT NULL DEFAULT '0',
  `stock_quantity` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '0',
  `img_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `location_id`, `name`, `description`, `category`, `price`, `discount_percentage`, `stock_quantity`, `is_active`, `img_url`, `created_at`, `updated_at`) VALUES
('359a3546-2d97-44ed-acc2-798b7b499e0b', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'SIKED', '@KKSZKI.HU', 'Koktélok', 510, 0, 10, 1, '359a3546-2d97-44ed-acc2-798b7b499e0b_229f64d6-ac0f-49e9-943a-3eebe237dfa7.webp', '2025-04-09 11:08:04', '2025-04-09 11:08:09'),
('5c2bfd23-c299-4132-827a-fe0f08f6dedb', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Pilsner Urquell', '0.5l korsó', 'Sörök', 1290, 0, 10, NULL, '5c2bfd23-c299-4132-827a-fe0f08f6dedb_64229360-3210-4d1b-8412-91917aa0ce0c.webp', '2025-04-07 16:59:03', '2025-04-09 11:08:53'),
('bd5aa4b1-288e-41ce-aadd-d4fe3832d7a7', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'leber', 'kasedd', 'Röviditalok', 10, 0, 10, NULL, 'bd5aa4b1-288e-41ce-aadd-d4fe3832d7a7_45d7659c-816d-4ac4-9599-559b011c6a35.webp', '2025-04-07 17:05:34', '2025-04-07 17:35:16'),
('dd1fdc7b-c3d8-449d-85ed-0a3fd6565df6', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'jhf', 'productpiohhljkh', 'Sörök', 1290, 0, 10, NULL, 'dd1fdc7b-c3d8-449d-85ed-0a3fd6565df6_0ec59051-8da2-4100-8c70-3283580f17a1.webp', '2025-04-07 16:48:15', '2025-04-07 17:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` datetime NOT NULL,
  `is_revoked` tinyint(1) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `token`, `expiration`, `is_revoked`, `user_id`, `created_at`, `updated_at`) VALUES
('0393347f-660c-40f0-92e4-3d8423ae9a4b', 'ca55ae2b8d604d67a85485a24bc9ac8c3d2f50c3f50c4739aad4a956d49d27f1', '2025-03-29 21:35:41', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-22 21:35:40', '2025-03-22 21:35:40'),
('06c7fbd9-a0dd-477e-bc8d-22be4e711b22', '01af4aa4aa1f4523843235dac8dc70de943ed47fd0df4484bcd9b783245295e4', '2025-04-15 16:28:23', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 16:28:22', '2025-04-08 16:28:22'),
('083b3381-c4bb-485d-93b6-6f4cbe9f6ef5', '0b872c65c0104b01a684d8a74b8e1f46ec48669023414584b3c337103f1c2ac4', '2025-04-15 20:19:22', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-08 20:19:22', '2025-04-08 20:19:22'),
('084fb17c-82b3-4a53-b546-2dcf1df8cf49', '55f7bab32f4a453f9a04bda358f6de187ebbd2b48a71430b8ed1a0c4cb8dd797', '2025-04-15 20:30:40', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:30:40', '2025-04-08 20:30:40'),
('08668a46-5639-44d6-8bb5-153d50624179', 'fc972978dd5742b48d75de372bb42301a5fbd37ff7534374873819f1042e77e7', '2025-03-28 10:08:36', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 10:08:35', '2025-03-21 10:08:35'),
('0960431a-48d8-46cb-980a-5f1aac069d01', '81657b0037434b90b702411363af88e6950266a5091d4aa79484fc484e5d8174', '2025-03-30 19:46:32', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-23 19:46:32', '2025-03-23 19:46:32'),
('0a903b0b-e270-4b5c-8722-d61f99ffddd2', 'dba39671165c4e44951f4de9fe73853fabdd9ded25074d0c922cf997f9203cc3', '2025-04-01 16:59:51', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-25 16:59:50', '2025-03-25 16:59:50'),
('0b683d49-4c73-4b10-bc24-aead428240e4', '0bd47d215a2f420db8567cc89323b070b97e638c66964bcb81d16c0718a85e51', '2025-04-16 05:35:02', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:35:02', '2025-04-09 05:35:02'),
('0c6dad40-96b7-4fa2-9e2a-a74d4ad3ae68', 'c450864669bc4aab891b951fd3b904629b89d2a9d51645afbe46327ba4205603', '2025-03-27 09:47:58', 0, '3b7d8f5f-f61f-4c93-b041-d38cc44f101b', '2025-03-20 09:47:57', '2025-03-20 09:47:57'),
('0d13c005-2400-4e5a-84f9-9e07716121e4', 'bf4921243b6242fea9e4ceb11ec7d2b91bd5a87576244ea1aebc76fc2d0e3c75', '2025-04-05 18:49:42', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-29 18:49:42', '2025-03-29 18:49:42'),
('0dba7465-b591-49a9-b388-be3abf4f14b2', '366a544ab6f04a09ba75688b61881d12784c726c260b4594a526ae0a7cf8e875', '2025-04-09 18:00:41', 0, '5eb9ed85-df1b-45a8-956c-be289a79bfe4', '2025-04-02 18:00:40', '2025-04-02 18:00:40'),
('0ee775c8-74eb-4dd3-a95e-0b7e4d7673d1', 'e00849b052d342ff99318991c733ec75ec4f7af8f8dd4c53a5793190e8e4b11d', '2025-04-05 17:43:28', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-29 17:43:27', '2025-03-29 17:43:27'),
('0fc28f3a-dab8-4027-bf54-734e32e5ec96', 'bb949106737c4638bd8a46887ab2c3e399055c99251d4ce98b67bf80185ee53f', '2025-03-28 12:29:17', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 12:29:16', '2025-03-21 12:29:16'),
('116ea4f8-a09d-4317-b2ef-85c29cecb395', 'eff4265099db42caae27f8dc48d532ce39dd45286cb04bad9b8baa16fa0e521b', '2025-04-09 10:10:34', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-02 10:10:33', '2025-04-02 10:10:33'),
('12fc5552-6971-49d0-ac85-3a4ce14f8fe8', '1f920e6034f44d48a18bd568eaba084440474212127f44c69cb53767b007581c', '2025-03-28 19:50:32', 0, '59b0053a-dfbb-477d-b01d-17c486ed8719', '2025-03-21 19:50:31', '2025-03-21 19:50:31'),
('13606504-dbfc-4d81-aba0-9ce7a381a008', '6e391bfce3f140e6a60c8af0bd242a4b85cd4ba9f40a4dd0ae826014a0c91aea', '2025-04-15 20:29:55', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:29:55', '2025-04-08 20:29:55'),
('13a0d0b0-7b61-421f-ad24-7b63655ac211', '317c094ea4e14163adebd2917eb4aefc715d71c9fb7845d7b413bda15d1ce7fe', '2025-04-01 13:38:48', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-25 13:38:47', '2025-03-25 13:38:47'),
('14378e8a-667d-4f60-8d32-d841063ac1f5', '0284c6490012426b87711974b9b8c86a0d55f06e77d246f1a42423cfe40080c3', '2025-04-05 12:10:16', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-29 12:10:16', '2025-03-29 12:10:16'),
('147b1aba-40e3-4987-ab91-c80ece1ae3e7', '7c04439aba5a48e59ae88c2eb9042e1c987952448f5a4cf793e9090c8b17f67f', '2025-04-16 05:37:20', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:37:19', '2025-04-09 05:37:19'),
('15c503c8-dd05-4472-bdff-03d664469ea1', 'b3de97a339244967a8c788ae49c7f1538a177d7679974abba75a85c7e3e5aab0', '2025-04-15 18:49:47', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 18:49:47', '2025-04-08 18:49:47'),
('188d6e08-74bf-4e1c-82b7-b29fcd12a500', 'ae114b1f1bd34a5eada4542b651b6b4ed817f0e3315b4992bd3667693fab092d', '2025-04-03 08:47:56', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-27 08:47:55', '2025-03-27 08:47:55'),
('1b0f3ffe-86ac-4857-a953-e547dc43fe90', '71a7d0b2093e4a8eb6f7402714c822ad89feec1256bc422aaa7bfc5f845f9cc5', '2025-04-01 13:20:26', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-25 13:20:25', '2025-03-25 13:20:25'),
('1e0cb840-4e48-4c73-baf4-12eb666027f6', 'be58b87ff8174e77996ffdcf50c1eef44d1da3f6aaaa41c39461b3a963099c88', '2025-04-10 12:26:47', 0, '63617d3e-edff-4c33-a6cf-f86170d93161', '2025-04-03 12:26:46', '2025-04-03 12:26:46'),
('1ef9337c-1f9c-4149-addf-27498524c583', 'ea18072904f14166a45ddbb0c42bc868ec7caffc4d3840689da7041a91480964', '2025-03-28 08:15:09', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 08:15:08', '2025-03-21 08:15:08'),
('23216461-d312-4739-b199-2a42fa5baa9a', '336f4f7b40c343de9ecc79a806f3268037e28ae11a6d45f788d31180a5ff1386', '2025-03-29 18:55:11', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-22 18:55:11', '2025-03-22 18:55:11'),
('25c141e6-6179-4680-84b9-80e59b183dfd', 'c50949a38f854f3689e4a6bef4755c9d8a47a876899742e48d665769b277acfd', '2025-04-02 21:27:08', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-26 21:27:08', '2025-03-26 21:27:08'),
('278aa4bf-c3db-4012-adc6-8afae511b4d5', 'bfa0d7fad65445cc902a4af22e6ee5c5b6c953f900314e3f8a565610121e1811', '2025-03-28 08:58:51', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 08:58:50', '2025-03-21 08:58:50'),
('27bd2551-9a00-4969-a857-a4d55306dfdf', '1592b75f68cc4de8b4c1dde13760722f3ec5cffcedd5494385479e3c6cfbf2e4', '2025-04-01 17:55:01', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-25 17:55:00', '2025-03-25 17:55:00'),
('28514f96-4505-4206-8ab0-9790d2fbc68e', '130547a2dfa44b439d372789d14612fc9c6279ff3b89424e923bd14dbcc78006', '2025-04-15 16:29:30', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-08 16:29:29', '2025-04-08 16:29:29'),
('2c652b66-1ce6-433d-8b97-1b05a6581b55', '85b4dc338ece42acb8ab6c64a92f7e655094e026435c40b2a577fd72a0a80938', '2025-04-04 12:35:04', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-28 12:35:03', '2025-03-28 12:35:03'),
('2ea2c4ed-ac8b-4bd3-9e27-67898feee3e4', '05af63442b71479a92a5273b01359f7998d7e8edc7964cdf8fbffa436087ebb6', '2025-03-28 12:16:42', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 12:16:42', '2025-03-21 12:16:42'),
('2f367325-b904-42c0-8c6c-6f3a05f74943', '8b265e0b98234958bfacf4e318ccdae5f177e9354fa84bf4b471f18b001393bb', '2025-04-01 13:28:58', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-25 13:28:58', '2025-03-25 13:28:58'),
('31740c4a-1e96-43d0-bbfb-211cff5499b5', 'bab81edbab074374a369bb3cfbd3de45a352c7c93ad14ae089d01f8b24016e93', '2025-04-04 22:58:24', 0, 'bba54a66-7e71-4e14-98e0-8f435e0b2f7b', '2025-03-28 22:58:24', '2025-03-28 22:58:24'),
('34ee94d5-e1eb-4dd0-a2a4-2f6bed454b48', 'da28b521bae044769f58efc03d7dc5cc2d95b579b3954b9f9b774545e81a481e', '2025-04-15 13:02:23', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 13:02:23', '2025-04-08 13:02:23'),
('35b15a6a-c018-4877-b496-e99d8c158d5a', 'b722559a04a149f48115fc59aa90254f789ebedf0709429a994eadcce1ddd0fe', '2025-04-05 16:55:16', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-29 16:55:16', '2025-03-29 16:55:16'),
('36431062-a32e-4a8e-bbba-20da886144ca', 'bac0c17bfe10486e8d75064673fb7fa6e81837cd576b47a5bcb4668b92fcbe3b', '2025-04-14 08:05:37', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-07 08:05:36', '2025-04-07 08:05:36'),
('377bd90b-2279-4323-bf8b-0555ff4cb5f6', '0812bf030a8b4cafa9c274eb934eae9e9a0dfe749e1341788c2a53c8ea2281d5', '2025-03-28 19:48:17', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 19:48:17', '2025-03-21 19:48:17'),
('38241a0e-7634-4376-bc9b-c2d6f16bf572', '032193025ff24f66b9e8b7a8ff8f66692362ef34f02a4c32963330fbcacef9b9', '2025-03-28 15:39:32', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-21 15:39:32', '2025-03-21 15:39:32'),
('38619d9b-951b-4b99-a393-612d818c5203', 'f3121f57bcc5485fa6d794add61afa2af4a7ea2f42e54ab4a31f1107aca7da60', '2025-04-15 20:28:01', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:28:01', '2025-04-08 20:28:01'),
('3a29335f-aa0b-488e-a233-c14339282676', 'c76f471185c0444d90c05a63ffb553aeede99e1be6f8431d964ce28af201b4b2', '2025-04-05 20:19:36', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-29 20:19:36', '2025-03-29 20:19:36'),
('3aaea96d-07d4-48ad-b572-b9ec8ddc96fb', 'fb5c1693045943b6baa83820951e41a11265999cee5446cf9b7deeaa8e448a97', '2025-03-30 14:41:48', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-23 14:41:47', '2025-03-23 14:41:47'),
('3b6bd451-99a3-4ed1-8d30-c215dad05a0a', '0b97ed76418e4c78913af6c20c0250368e2712ee9d204a10a3181c30d13bbaab', '2025-03-30 13:55:08', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-23 13:55:07', '2025-03-23 13:55:07'),
('3b7f8697-24a5-4ac0-aadb-c8f50ecf02ad', 'f514504d691443a0b716dc0289c5ff89ff0eee8a192a41b99fbc2a3eb0f328bd', '2025-04-04 11:38:21', 0, '3b9087fb-2260-40cd-8a28-08111c518576', '2025-03-28 11:38:20', '2025-03-28 11:38:20'),
('3d143948-b554-4152-ab9f-ef073198aa8e', '14d387202ede4bbeb37600143ebe3ca69352160e44dd45c19f91fcd20ba2739c', '2025-04-15 20:29:25', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:29:24', '2025-04-08 20:29:24'),
('3eed51f6-7bd3-41ee-9261-957532c2c748', 'fcaee8eb5b8e4a22a59ecd59b399d8d5258db992434d4148860f625563541303', '2025-04-02 19:23:20', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-26 19:23:20', '2025-03-26 19:23:20'),
('3fcec548-c1c9-4a3a-8634-01c65fdfa23d', '493f3428e1264c4ead0b1185300bc20c59c4b78b889b43418c89a59dd9d24c72', '2025-04-14 06:36:58', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-07 06:36:57', '2025-04-07 06:36:57'),
('41652044-c8f7-4c01-a181-9081b8bbe485', 'e6093e8f92294c7ab902d52e42a5adfa1cdaea3a820a4e34b7484ccd09656f07', '2025-03-30 14:50:52', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-23 14:50:52', '2025-03-23 14:50:52'),
('437006e8-ee50-4ad3-bc96-ccb3d709d7cc', '488b817708a94740adeab9c4aa549e379c31c09503324d4a97288540e971f0cf', '2025-03-30 14:45:34', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-23 14:45:33', '2025-03-23 14:45:33'),
('468dc9a5-e76f-4c36-a165-9baaecc493d1', '3c1010ca294a42e29472ef49a4b9c3c693294f8bc53548c6acbc9a2915d5d4a7', '2025-04-10 06:18:25', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-03 06:18:24', '2025-04-03 06:18:24'),
('46a68118-c710-43a7-99cd-4e99c8009e7b', '8e053fcc60094e28b25aca856196ee4fb5b28d9faae24191a77e7e24c3c69898', '2025-04-16 05:33:49', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:33:48', '2025-04-09 05:33:48'),
('47438d06-5807-4540-8047-5ad9466a93ce', '514c82f3789a40079a5b3f254a79ddff1694c21a180842f6a6124eeab9cf728d', '2025-03-27 11:41:32', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-20 11:41:31', '2025-03-20 11:41:31'),
('4ae5c428-f1f4-4327-9e29-76694f6f763c', 'b251627430254a22a9420d92bc6be60faac181c00a394a22b92f4e7e8669634c', '2025-04-16 05:29:48', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:29:47', '2025-04-09 05:29:47'),
('4e6afd59-e89d-4ffc-8b67-2ac31df47986', '61c7b926c8984f3fa540cb81864f67f6500dfef3b5914f69b279843f8c31faa7', '2025-04-02 17:06:12', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-26 17:06:11', '2025-03-26 17:06:11'),
('509dfc24-6d96-46f6-b147-4c8ea8ece1ba', 'a31de1e80fa24182aebdadfa51ec01f735a7642b079a4235ae506fc91728e87f', '2025-03-28 20:01:08', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 20:01:07', '2025-03-21 20:01:07'),
('5199d683-213b-49a4-bc02-d6e25b97335b', 'd75b68c7a49549bcb5ef42c2684f6333b93056adff6c432fa3338d7d0caeda61', '2025-04-14 16:46:11', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-04-07 16:46:12', '2025-04-07 16:46:12'),
('5328153f-f9cc-4dd0-a7dd-739177fbc1da', 'e8c10d796d0e48c5b5065dbead5ece42721f4bd87e7441db835843b070ec8f86', '2025-04-06 13:21:37', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-30 13:21:36', '2025-03-30 13:21:36'),
('5484e433-735f-4483-8841-f8f2425965f6', 'b7a71cb9897546c490e7acecdfc3e8d604c52b73dcd24a48bc9346a1513c3650', '2025-04-12 23:30:41', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-05 23:30:41', '2025-04-05 23:30:41'),
('56cac7ef-5332-413b-ba59-4d8680b5099a', '9d3f4cf16d774ae0b9e9dbe89257b093e40a33abae0f4ddcb514b9a05663e641', '2025-04-16 10:15:19', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-09 10:15:18', '2025-04-09 10:15:18'),
('596ca967-99a7-4327-b09c-21ca2638a8ea', '7e8cb0cba8b048279a869e371d7d4e174956bfd3ce104d8795a6842a99476533', '2025-03-27 08:22:03', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-20 08:22:03', '2025-03-20 08:22:03'),
('5a930db4-dbf6-41da-b416-bf192d9d9c61', 'd534b2c5984444a0ad8758a703d930095343bc11d42045b8804e05dccb02e131', '2025-04-15 20:23:49', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-08 20:23:49', '2025-04-08 20:23:49'),
('5be0d31e-f150-437e-9f9b-f5fa74e0ece9', '51535a799991487d9074f7d36602035cb906c455c4c0477c898e187a9ffdc247', '2025-03-27 08:50:07', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-20 08:50:07', '2025-03-20 08:50:07'),
('5c0f671a-8cf8-47c7-bdcd-ea547b5797c1', 'b228c8fb83ac4200a01588da1f1b2dff1bc44e48fe774cf39f9386179dcc83c3', '2025-04-15 19:37:44', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-04-08 19:37:43', '2025-04-08 19:37:43'),
('5e19fab9-4f1c-432e-90b8-447426e7b784', '97a808a63e7e4cb28c67cc0ac19c2cc85b6376951b2e4fcba79fac04ebe4ae99', '2025-04-16 05:29:12', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:29:11', '2025-04-09 05:29:11'),
('6095c871-45a9-4d1d-baed-bea4077f2be2', 'dee5bab0563742d2b5d22a8cf93e748fbfddfd4febbc491da1407cfc8cb6c6ca', '2025-03-28 12:23:56', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 12:23:55', '2025-03-21 12:23:55'),
('62a731f3-e5dc-44d8-b588-55d242ff5db8', '94520355cbe94784861db41a1172faa05be31008ed004cf4aec00a2115ec1c8c', '2025-04-07 09:46:26', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-31 09:46:25', '2025-03-31 09:46:25'),
('6331478f-ebaa-4be9-8f6f-a9151b42db6e', '25e23ba70bbf403b8819e041d4f3f0698c086d0521ce4f1d91a264cf70d37be7', '2025-03-29 20:38:12', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-22 20:38:12', '2025-03-22 20:38:12'),
('63d10717-178b-40ac-8d51-dcfe73da057f', 'd55e4d4183e942a69d9d0a3cb6cc2edf3d48ef31cfdd4262819f4f005b01d9b9', '2025-03-27 11:09:06', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-20 11:09:05', '2025-03-20 11:09:05'),
('651fae17-5baf-4b27-bef1-98f580ec4c78', '379867e0a66a4eb8afde3913cbdec5b05cf025f2fa8740bd93c7c10e39e9021f', '2025-04-14 05:49:43', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-07 05:49:43', '2025-04-07 05:49:43'),
('65298504-b5bd-4705-8e54-70d92da83c67', 'a33f61e872ff4724bd5606a2a42a1e5afa76c1c9bdc249c384f27bce8aaf6a67', '2025-04-01 13:20:59', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-25 13:20:58', '2025-03-25 13:20:58'),
('667c1ff7-73e5-4c4f-81f7-53d8ff2534b8', '18441c9238ed4f55aa72184ed1fc0bcbe6b3c49244f842b3961148a30c2c1e1e', '2025-03-28 15:35:38', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 15:35:37', '2025-03-21 15:35:37'),
('674dbf12-516e-47ae-9e1a-b44012c7bdb2', '9ff5a6deebbf43c58ed87d1c5178d9aeebd09c48e0fc49e3a656aa87f1f3ce56', '2025-04-05 17:43:36', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-29 17:43:35', '2025-03-29 17:43:35'),
('6830bda4-0a07-414b-87cb-b4bbb128c904', 'c88cb8617e324f81a8ab980395346d137ef8c856a3ad4246bf4d19994af8d558', '2025-03-28 15:44:01', 0, '1e977aa5-ddca-4874-91e3-35520b593a68', '2025-03-21 15:44:01', '2025-03-21 15:44:01'),
('69a641c4-d3c7-4463-ba32-97a720b80528', '643ae2d465c04cb3b2f44ba3f6346fe7d388218685c3474ea24a40739aba00ef', '2025-03-29 17:35:17', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-22 17:35:17', '2025-03-22 17:35:17'),
('69d1a4dc-ee56-47a9-a233-7eb87f4f48a8', '717e8b434d3b4daeb860226ef0b225a188c763e481c1411388fe18fbcccec330', '2025-03-29 17:34:57', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-22 17:34:57', '2025-03-22 17:34:57'),
('69e5a89e-d72d-476a-a4bb-38066e60dcee', 'c96c55672bc2402e94a8601d2de794d43ffce95a25c64ae0874265490e31af13', '2025-04-16 09:37:04', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-09 09:37:04', '2025-04-09 09:37:04'),
('6ab38d33-bf24-4e02-a3ec-264226317be2', 'f1374c309a7b4d13a2dade87678eb09555d3f7a4d2a3430a994b7db48b2c9396', '2025-04-12 13:50:32', 0, 'b3d15650-5a60-4d1c-a2f4-35dc92e824e6', '2025-04-05 13:50:31', '2025-04-05 13:50:31'),
('6cc71431-2097-4c50-9618-cbb7c506e00b', '57caa1e99fee4bdda4ba6f1842f3ea29242ba4307e984a7e8590b4f9a30f0c9a', '2025-04-13 19:03:04', 0, '1e977aa5-ddca-4874-91e3-35520b593a68', '2025-04-06 19:03:03', '2025-04-06 19:03:03'),
('6e3081e8-5300-44b1-9c6a-f1dc968ea57d', '6528501fd4c84ad5bf3b658783fb0dbbefd6805707df47069d223ad91bef0c8e', '2025-04-01 12:57:56', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-25 12:57:55', '2025-03-25 12:57:55'),
('6ff5b059-bb19-4eea-bf28-1a2e360823c9', '44299fe7cacc4855b29c1c8fa30095fbce539943c2224bd6854c8dcac2dc2a9e', '2025-03-28 10:08:25', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 10:08:24', '2025-03-21 10:08:24'),
('70abbf7f-b656-4f97-923c-088281baa2e1', '2918e13eccb5416f9ec0b4d1e9fe58c29466bbc4069b4a8fb1eee4e650099375', '2025-04-04 08:45:45', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-28 08:45:45', '2025-03-28 08:45:45'),
('71fff1b5-fa3d-4c2d-890c-bcefe194a9a5', '735da3e7624d46ee9105728d9d399f6e8c1cc9df5b7649469177345cb6578902', '2025-03-28 11:59:37', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-21 11:59:37', '2025-03-21 11:59:37'),
('734bf708-8092-4332-b9ce-e65876ddfe0e', '38c29ca3cce440c28231489f3db0d70e8c7c56f35eed4872acb9ae13eaeaa3bb', '2025-04-01 13:14:12', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-25 13:14:12', '2025-03-25 13:14:12'),
('7515fb14-dcf4-408f-80b7-2b59c630afb6', '8dc609391c734a48947a2d00d34e09c4dbf36e95906949b6bc3b661333254ac4', '2025-04-01 10:47:34', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-25 10:47:33', '2025-03-25 10:47:33'),
('758d0da2-6d7a-4866-963f-e59ba9dcc4b6', 'ae9af248253d4d378f1fe5afeccaeb2f315b793726db4e6e9265f34e3fc72d6a', '2025-04-09 14:00:20', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-02 14:00:19', '2025-04-02 14:00:19'),
('76369470-b4cc-4d07-b5f6-db89d773b821', '57ae612475bd4d0cb853fd2081381bc41b09739edf93473fbcb093cf47897e3d', '2025-04-02 11:59:44', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-26 11:59:43', '2025-03-26 11:59:43'),
('77269d06-4950-4271-8ff8-e21563e4e0fa', '314c072d0cbf42988cb1f47cdf80e99b713f2e0475f848d980d8569a531cf771', '2025-04-02 17:06:21', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-26 17:06:20', '2025-03-26 17:06:20'),
('774af3f1-432c-4e30-8efb-f0a8a22a543c', 'b24edfdb343a4d308605883fe68f8dcf98dcd7acda654e528fc001a722180068', '2025-04-04 19:30:13', 0, '3a018d16-c6ea-458c-8be7-a646fbd70b82', '2025-03-28 19:30:13', '2025-03-28 19:30:13'),
('7d060575-1dc8-411e-895a-be47a181d51e', '20bc32d2407745e5b73154a688839fb3bcbbcaafeb014944bfc8bb89cac5a359', '2025-03-29 22:04:12', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-22 22:04:12', '2025-03-22 22:04:12'),
('7ed22459-fe09-46e1-980b-0de77978e543', '650e8d27820f436db5a3ffaed5ff825d1697bbfb771149a5b50f453147d1dcb4', '2025-04-14 17:12:24', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-04-07 17:12:25', '2025-04-07 17:12:25'),
('7ed62a63-47af-4bda-8708-b962c4c7a236', '5bc52f0f169445ecb7efb9d3eb8af04fa6dec5f62c344c3995870875790d873a', '2025-04-05 17:39:29', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-29 17:39:29', '2025-03-29 17:39:29'),
('7fb5fd5b-2e34-48b9-ad5e-d2db86487467', 'eababff0df66414a9bcf8a5b3a82c82a99cd78b72b10451e96c087a1227be10d', '2025-04-08 14:35:25', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-01 14:35:24', '2025-04-01 14:35:24'),
('80edbb95-aad0-490b-b06a-19aa8ce195ad', 'fea8568cf38149f09dc2f58cbde3ccc9b7d3cc87c04149009b884061a3ba5474', '2025-04-15 12:57:56', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 12:57:56', '2025-04-08 12:57:56'),
('829fc4a4-cd3e-459a-b05c-ac3bbaf585fa', 'ca86f416a7554634b0ff16fe490a0e1343b4aade32a5483b926c4df8c4aee257', '2025-04-05 20:44:30', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-29 20:44:29', '2025-03-29 20:44:29'),
('833b8345-4998-4bd4-b478-cebded2a8eb1', '0134ef4f163249eb8f414ad32b12668a9eb808e2e0a04ae5bff7e95aa6da2103', '2025-04-10 12:22:54', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-03 12:22:53', '2025-04-03 12:22:53'),
('85957426-1a7f-45a9-b3be-65f452821bdd', 'd2cb54d1c34340999ecea7607b8b38009d5ddda7ece847d1bc44696ba17d5c49', '2025-03-28 12:18:22', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 12:18:21', '2025-03-21 12:18:21'),
('87085d8a-8a14-4f59-b903-83663dd12332', '7206c6d2e725481bb1dc0def8b03e7b6faa77e84697d415587311742fdf00d22', '2025-04-15 12:44:41', 0, 'b49f053f-9d59-4359-b9f8-e00a50f5145f', '2025-04-08 12:44:41', '2025-04-08 12:44:41'),
('880e29f4-9f0d-42ee-9229-8cbf110d5ed0', '6229885f75c24c999dbc66662d778e13154a717666954660bde8116d9615d810', '2025-04-07 06:02:09', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-31 06:02:09', '2025-03-31 06:02:09'),
('89fcac64-c052-44ff-acd3-bf44ad5121e8', '8e4fee02c02440709b33b67094d600c08c273a385d1d4dc5a178ac6b17ae4d7f', '2025-04-15 20:26:50', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:26:49', '2025-04-08 20:26:49'),
('8a0ce03f-7395-41ee-b82a-7a5c625ed64b', '4698a4e0b9534daea24418013847c66ac3387ab95f234ae0817fdc2f3e9b3cd8', '2025-03-29 17:32:46', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-22 17:32:45', '2025-03-22 17:32:45'),
('8a743b2e-74bd-40f7-bc02-761e81461423', '462fb534373941698a46271982de1b3e7500629f15584bc7a22f10da3eeff04d', '2025-03-28 09:21:49', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 09:21:48', '2025-03-21 09:21:48'),
('8c140571-c4db-4c0a-850d-4f6005ff5a60', '64c299407a284e1fb64751e405067e36f31ad09b4f50458ba44f0ac715324e16', '2025-03-27 09:13:09', 0, '60d6b130-dd78-401d-ae22-ff910d2de993', '2025-03-20 09:13:09', '2025-03-20 09:13:09'),
('8cd2f1e1-889f-44f4-bc3f-a6098417aef0', 'c3db30b9af4a44f68f1b23a83f95ebaf2410aa00089140119c075362aca2650f', '2025-03-27 09:23:32', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-20 09:23:31', '2025-03-20 09:23:31'),
('8ee425cb-c272-4ae4-b29d-e60e6e4d85e8', '2f427b55aea3485a8a0a4899dca68faba9fa8b190c174280942ecfcdac17b00a', '2025-03-28 13:19:15', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 13:19:14', '2025-03-21 13:19:14'),
('8ef89b9d-46f4-4dad-8062-b0974c810758', 'a39dea85508d4f0ba1263b2fb4723998139b03339613402194bd990b1f8d851b', '2025-03-28 08:57:47', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 08:57:47', '2025-03-21 08:57:47'),
('902480bd-dfdd-4e67-918e-85fd23ec31d0', 'ad07b4ba785e4cea99ab752fb894b20a5125974b110249d19da134c85a62e099', '2025-03-28 13:24:01', 0, '9eaa68e2-25fc-4e9a-a1a8-2f8cb7e82d11', '2025-03-21 13:24:00', '2025-03-21 13:24:00'),
('92c147ec-6341-4f1f-8167-83b15037f41b', '4e0761ac7a5f4a9298fd21163d57e7019acfc7426101403c876f519bff23ac54', '2025-04-04 12:48:39', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-28 12:48:38', '2025-03-28 12:48:38'),
('94bfe75b-f39f-47af-9d07-bb19772c6df2', 'dbbd4e407989488a99067da881fd4a81fa5c51f484454d0aa6b841ae9c5cf084', '2025-03-30 14:43:19', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-23 14:43:19', '2025-03-23 14:43:19'),
('97b8fd9d-7062-4a15-8337-6fd42f97fa8a', 'ed1d029736f743eaae3138975e9b23c693a48e1275d546d79732cb80d135f0c2', '2025-04-10 07:00:45', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-03 07:00:44', '2025-04-03 07:00:44'),
('97d5f5c7-cab1-457c-a550-7f779dab2153', 'c9d5660b5d5543108bd110dfa2fc0c08eb024dd457ac41e2bc39ca15e4eedb35', '2025-03-29 12:56:15', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-22 12:56:14', '2025-03-22 12:56:14'),
('99bd5832-7f12-4ba6-896a-dec6dd3b6f2b', '46f61d6dc7e541cd94d9cce5b01653b9bcf9cf28f18747fca7907ab88a817833', '2025-03-28 12:08:58', 0, '59b0053a-dfbb-477d-b01d-17c486ed8719', '2025-03-21 12:08:58', '2025-03-21 12:08:58'),
('9cfbf927-262c-4176-8c52-0052e1988038', '2334fc70f09b460e8ce855e97dc70c6c3f4cd9c39d044b4084f131e03d4307e4', '2025-04-06 13:23:54', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-30 13:23:54', '2025-03-30 13:23:54'),
('9d3066a4-6500-4a96-9760-3a2ef72d58c4', '5f2f7395ed9c4941843c5605912f155249dc9ae7e002478eb27b557a93700ab4', '2025-04-04 09:04:35', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-28 09:04:34', '2025-03-28 09:04:34'),
('a339006d-c7fe-4ea4-83b0-76ef2c8e2497', '053c2c1fee574d769547c2957bb09e7a7ab9d16c076a44a0824b08d0081044f1', '2025-04-02 17:14:59', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-26 17:14:58', '2025-03-26 17:14:58'),
('a6ea9746-da6e-4686-886f-b20434ad796a', '185ce6c0e24e477f9674cdd08574da386accfc8a441540c2bf78d3659b1b226e', '2025-03-27 09:44:05', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-20 09:44:04', '2025-03-20 09:44:04'),
('a77e67f0-f2af-4f0c-9808-688a24b164ba', '4d3059b97af745aa9ad49a9b7956122432e5a9f9ae7a4276a2e5b76ea1fa8dd2', '2025-03-27 14:24:11', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-20 14:24:10', '2025-03-20 14:24:10'),
('a79e245e-e71d-4a14-b026-9a87bbf5bda4', '764e4e914ca44c8887f4e0177b4d552c6d41bc3c60244aab838eb2a02304867a', '2025-03-28 12:28:17', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 12:28:17', '2025-03-21 12:28:17'),
('a827c5f5-91f9-4dcb-b542-9f52fd38d169', 'd0a36a0afa44493bad5d4586e3829055f156a5dd1c324b9fad876f37899427de', '2025-04-15 19:38:37', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 19:38:37', '2025-04-08 19:38:37'),
('a8739c68-1b32-4258-ae76-531559965ca1', 'd1bd8f2eb95d4f6095668ce49223378b70f87a1f649948558527f75c64f32367', '2025-04-04 15:03:52', 0, '60d6b130-dd78-401d-ae22-ff910d2de993', '2025-03-28 15:03:52', '2025-03-28 15:03:52'),
('a913671e-6451-43a3-ae52-aa027deae6bf', '50cf89214d954233adb839fab81232730d41365622fa4b6eace44d649f695052', '2025-04-15 20:28:56', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:28:55', '2025-04-08 20:28:55'),
('a98c6c50-e93a-49b5-b7fc-717523996f5f', '0a68e5b265cd48d19f3cda0a28990ec32ed2882dfa7847b3ae862939f079320a', '2025-04-02 17:18:39', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-26 17:18:39', '2025-03-26 17:18:39'),
('a9ddb266-7fc3-4f5f-b70a-3c3c2d3de6d2', '0f078745c319471fa39248f22e8eed2b92339cce481649a7883c79761a970e48', '2025-04-15 20:25:01', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:25:01', '2025-04-08 20:25:01'),
('ad95a1e8-6df1-46fb-9d22-ba92da7fb269', 'b07e954b0d36474aa02ef34f2a37fba7405879b8800a472b85ebefdff37d7299', '2025-04-01 10:46:35', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-25 10:46:35', '2025-03-25 10:46:35'),
('ae8c1850-7f8b-4a4c-acaf-fca4cb631c3d', '3a841d808fbf4402ab9c9516d07bf6502a60341bc3c1466b86d1a7b163212429', '2025-04-16 05:39:03', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:39:02', '2025-04-09 05:39:02'),
('af107b0c-2e5f-4c93-adb5-3bd5b9e291a9', '403add6888b4414cb3070f08b24283ac1b16cd28653640c0aaab1ce00cac9d6f', '2025-04-15 19:38:16', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-04-08 19:38:16', '2025-04-08 19:38:16'),
('b7e3e124-ca47-4d38-bd70-e8156d3d5b70', 'fe265eda80824a1da0238fec098eb1549d66abb50e0d4097be7317156c715333', '2025-04-06 13:08:22', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-30 13:08:22', '2025-03-30 13:08:22'),
('b89fde9b-bf7a-43dd-b7c4-50037836d8d7', 'ca54f37a58e34f48a54e36a77285e29981c5099e1c994ff8965ffb358a80a72d', '2025-03-27 18:39:16', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-20 18:39:15', '2025-03-20 18:39:15'),
('b9e75f09-1cb6-46d7-9ff3-413cfd9b70ba', 'f1cb48e81e9f4572aa4c7c935d9841c48bf14acbd36046d287365c6145f90562', '2025-04-10 12:24:03', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-03 12:24:03', '2025-04-03 12:24:03'),
('bbac3333-c705-4422-b6d1-9a74d7d92147', '2215e9adf99949749bb2000d48f93c7eb64854ce6bcf4c4681d1beaea711213b', '2025-04-14 18:18:53', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-04-07 18:18:53', '2025-04-07 18:18:53'),
('c0c8d9d4-4a7f-416e-a19d-4fe0d9cff54d', '65390d544dd945c98cfe4b244932f3873da52425631141d2bc1956d46174163f', '2025-04-16 05:36:53', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-09 05:36:53', '2025-04-09 05:36:53'),
('c253566f-4ba1-400d-946b-c3e6148fb2fa', '4438129428a24635b31f792bb89b9087ff25e0cab2404ba7986e5aa781c59647', '2025-03-30 19:46:38', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-23 19:46:38', '2025-03-23 19:46:38'),
('c480df36-df2a-42d4-b715-72470682336f', 'd2960645ec2e427ba40c709c3f4773540610da5fa484465a99d736719b91b04b', '2025-04-05 20:44:33', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-29 20:44:33', '2025-03-29 20:44:33'),
('c7ad2058-9d00-463e-b0be-5e0346cb29e8', '5555a97397594f089bd0e25a7c7d5d1f5185e98afbd84993b7c7f8e8f61d397b', '2025-03-27 13:21:11', 0, 'a7482c8f-ceb4-4bba-abe0-c4bca1096d65', '2025-03-20 13:21:10', '2025-03-20 13:21:10'),
('c8035f57-9b76-463a-bb26-3e43284af5c2', 'c0689f487aaa424493437b1943cc8d0cb692caca1cd34960a602f1c15a6ab6be', '2025-04-04 12:47:51', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-28 12:47:50', '2025-03-28 12:47:50'),
('c9071a69-71ef-4fd7-9263-2cf2fd32f44d', '925f7729292847818298d06532b52b2eaeeb4ad4866c4fcdbbba7c386e5488f1', '2025-03-29 22:00:45', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-22 22:00:45', '2025-03-22 22:00:45'),
('c93aa5f9-16cf-4d89-972a-725ed084f5d5', 'ad1a232a08c34e458df8613b3f6c5b9710dc657e65784440b68f133dc1978d9a', '2025-03-27 08:56:59', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-20 08:56:58', '2025-03-20 08:56:58'),
('cb7044d7-61dd-4d4c-ba80-aa1d748120dd', '9464281db7694e9b91db78df8f0c13af182732e9bc504bf29e59c2aadc694cc6', '2025-04-15 12:44:42', 0, 'b49f053f-9d59-4359-b9f8-e00a50f5145f', '2025-04-08 12:44:41', '2025-04-08 12:44:41'),
('ce305c3d-e30a-441f-a964-e2a1f3455915', '78d5b1f42b9c466fa5a44bf7866b49824c1bd925b48c4ae68dc80e70b77d2acf', '2025-04-02 21:34:42', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-26 21:34:42', '2025-03-26 21:34:42'),
('d0979857-c41b-49c6-b18a-c54d488d14ab', '0a0051b6a39a49e7a692d0847a2bce7abe980a8cc16a46aba1a715588dfd2f78', '2025-03-28 15:53:05', 0, '1e977aa5-ddca-4874-91e3-35520b593a68', '2025-03-21 15:53:05', '2025-03-21 15:53:05'),
('d21382bc-2345-47ad-afbc-72f3fae1aa5a', '0211045f764c4d209637a2ea2a0a58897bfe64145a0147d58002a52fb41a5122', '2025-04-12 23:58:26', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-05 23:58:25', '2025-04-05 23:58:25'),
('d3269af9-8edf-4839-883a-f17b021588d6', 'b1221818e6684935bce10d1495c5e9123236507501a44d4aaca3ff595863ec29', '2025-04-15 20:25:09', 0, '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', '2025-04-08 20:25:09', '2025-04-08 20:25:09'),
('d45bcbd0-48f0-40ab-b766-43e2b260a6d0', '94cdb6c5389d45a686cf2f7e4010010fd66a8d00516747588521834b824230f3', '2025-04-02 19:26:58', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-26 19:26:58', '2025-03-26 19:26:58'),
('d706deb6-e625-426d-a088-9a0d14e8fe2c', '2493e53fb5fe44ceaa691cc1b8deb11865165659868e47388b43f970c72567fb', '2025-04-04 12:44:57', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-28 12:44:56', '2025-03-28 12:44:56'),
('dce7529d-667f-4389-938c-ad91ba725da6', '4483cbd639b946f2958a3cbf639bb8295f616c11cab9473e84e05665d8ac073c', '2025-03-28 19:58:48', 0, '1e977aa5-ddca-4874-91e3-35520b593a68', '2025-03-21 19:58:47', '2025-03-21 19:58:47'),
('de8c0a49-9bc7-4206-a467-8b76f5ce174b', '9abd658f71414014a2e72ae63bc44c1483c632186911479aace1810372594fee', '2025-03-28 11:50:34', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-21 11:50:34', '2025-03-21 11:50:34'),
('df191816-2f4f-4b2a-b6db-cf5d1dcfbe53', 'a5a71b0d2166467c842f76cf68850b7ecf0f8cadafd4495396a1786597dfd145', '2025-04-05 20:39:52', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-29 20:39:51', '2025-03-29 20:39:51'),
('e1322e9f-4bf7-4df4-a3e5-32e341e59446', '78a1800fc7824a08b1f729ddba221194b2ee46a77b7d4c06abf7c284ff845f69', '2025-04-03 22:31:58', 0, '88edc429-ec37-46ba-8a40-39ca4ad46f51', '2025-03-27 22:31:57', '2025-03-27 22:31:57'),
('e5e9c123-338a-489a-b77c-dad7c46aa5f3', '19b3544d5fdf46bead6a2c66c2443c6eee1de1c39e7b49e5b13bbc67671841be', '2025-03-27 08:52:10', 0, 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', '2025-03-20 08:52:10', '2025-03-20 08:52:10'),
('e86b5ae7-d76d-4dac-839e-e1e1fb173c0c', 'b8b84cb38b5f44ebaf554be743e93ef553a71175af994c5492ba222c0360bf97', '2025-04-05 18:11:41', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-03-29 18:11:41', '2025-03-29 18:11:41'),
('e88728f0-50aa-465b-9e4c-35c23d348056', '78ee7b563e0d425887399e047467bbd32e56a9405e4a4ce1bbb198da0430c761', '2025-03-27 08:21:30', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-20 08:21:30', '2025-03-20 08:21:30'),
('ec18016e-ae01-40bb-a461-90d2234455e2', 'dadd494751354452986eca5b934bb961c2d6d30e0ce54ffa900677afd7cfd168', '2025-03-28 11:52:01', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-21 11:52:01', '2025-03-21 11:52:01'),
('ecb656b5-2137-40b3-8e10-dbf9f3f890d0', 'fc93f0f1d29e452aaea367f810963bf7af3afe61252548978a49ede3c3c0348f', '2025-04-15 20:17:41', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-04-08 20:17:40', '2025-04-08 20:17:40'),
('ee028d74-d489-4107-9c77-169598bd1049', '2376a8b2af484547bd9a578bd5cbc0463488e85d74dc4bc5bb3136928607027a', '2025-04-15 14:59:36', 0, 'b49f053f-9d59-4359-b9f8-e00a50f5145f', '2025-04-08 14:59:35', '2025-04-08 14:59:35'),
('f263f83a-ab2c-4646-9191-7d9fb4165190', '3213aa6a1b2f4027be8180b9c485588077f4e24c88d247cf930586c8a31802d8', '2025-04-02 20:40:51', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-26 20:40:50', '2025-03-26 20:40:50'),
('f7b01a93-23f7-4164-bc10-adef4c938e17', '095a5b94004e4582a8d1dff54e14105b99fa82489a5e40a5bb06878db9097e8d', '2025-04-06 13:09:50', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-30 13:09:49', '2025-03-30 13:09:49'),
('f7d68d36-081c-4245-a870-8bbcf75c2824', '9fe8017e889e49f8aafb8f45f045f9fedddd0952c52d4fa696a38ccdfb25665a', '2025-04-01 10:48:22', 0, '9d59a117-ce83-4c29-a2d5-7360daab1c8a', '2025-03-25 10:48:21', '2025-03-25 10:48:21'),
('f9879f63-52db-411a-b141-3f46a28acb26', '865e17b9c68f48a4b741f5193f6c3b9cb01df2e46ea844a5af0683a7e94c9e5c', '2025-04-01 17:54:46', 0, '28c9767c-cc7c-4948-836a-512a749df074', '2025-03-25 17:54:45', '2025-03-25 17:54:45'),
('fa33319d-e1fa-489f-ac68-a0e60799fb85', '485b013163ed441e8c765c3ceb7813626b74ff60bd3741ada046aa7ebefd0b82', '2025-03-28 15:20:11', 0, 'dcbf0db3-4e60-4faf-8a4e-f553dd026771', '2025-03-21 15:20:11', '2025-03-21 15:20:11'),
('faa21ef7-c601-4eed-8991-fbab03485db5', '7bce4e490ffe44399e6517f87c0fc34b177631391c4d41719bf68605ded42682', '2025-03-28 12:38:08', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-21 12:38:07', '2025-03-21 12:38:07'),
('fd7b0f4c-7a79-43f2-86ff-a52ccba002d2', '59cf56792f64457bbc6a71b94d22ee82273f4b8536ba4e9f8729cd0177e85ae9', '2025-04-15 12:44:48', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 12:44:47', '2025-04-08 12:44:47'),
('fe62debc-1187-4440-85b6-0fcecc2e0e2f', '352eb9f9037e458bab3ae15e904df59c85d5aa8f98514726957008f4ad4da7cf', '2025-03-29 18:58:40', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-22 18:58:40', '2025-03-22 18:58:40'),
('ff063061-f892-4916-b1b1-946820992a56', '1ae8ead59d9943d796a88a4ab1cb607c25df92b9bc26420ea539ce4fc83c1413', '2025-04-15 19:40:27', 0, '3890fc3f-42ce-432a-ac19-ad665f39a976', '2025-04-08 19:40:26', '2025-04-08 19:40:26'),
('ffa07089-10d8-4db0-abee-4c5b67faaa84', 'b08b4cff94764884973803c7addfe1044a83c4a8a0704c5da1a902563b3efc64', '2025-04-05 17:57:32', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c', '2025-03-29 17:57:32', '2025-03-29 17:57:32');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` char(36) NOT NULL,
  `number` int(11) NOT NULL,
  `capacity` tinyint(4) NOT NULL,
  `location_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `number`, `capacity`, `location_id`, `created_at`, `updated_at`) VALUES
('24056f9d-5ba7-421e-9b7c-cb5cac394542', 3, 4, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:41:54'),
('35180096-350b-4e2c-ae99-2f35caefe16f', 3, 6, '2d73302e-028c-4136-bb20-956881966534', '2025-03-21 11:52:31', '2025-03-21 11:52:31'),
('57895900-d28d-41bb-a759-29dd208d4e69', 1, 4, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:37:54'),
('59eace57-537b-4b9a-954a-d66e194b165b', 5, 8, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:38:08'),
('5be216bd-1498-4a93-b56c-7970292c24c5', 6, 8, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:40:08'),
('5cba81dd-672e-4f23-b79c-2e8a9129ed15', 2, 6, '2d73302e-028c-4136-bb20-956881966534', '2025-03-21 11:52:26', '2025-03-21 11:52:26'),
('798f5222-25e6-4275-966c-87ddbf0009d6', 4, 6, '2d73302e-028c-4136-bb20-956881966534', '2025-03-21 11:52:35', '2025-03-21 11:52:35'),
('a854c1f5-6bb5-49d2-940d-21760bc4bf24', 2, 4, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:37:08'),
('b361f435-f7a8-4603-908f-205daac7d6dc', 1, 6, '2d73302e-028c-4136-bb20-956881966534', '2025-03-21 11:51:15', '2025-03-21 11:51:15'),
('ddba8ae3-68e7-4039-99e0-7df26de94940', 4, 8, 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', '2025-02-14 10:32:48', '2025-03-20 09:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `table_bookings`
--

CREATE TABLE `table_bookings` (
  `id` char(36) NOT NULL,
  `table_id` char(36) DEFAULT NULL,
  `booker_id` char(36) DEFAULT NULL,
  `booked_from` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `table_guests`
--

CREATE TABLE `table_guests` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `booking_id` char(36) DEFAULT NULL,
  `status` enum('pending','accepted','rejected','') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `legal_name` varchar(50) NOT NULL,
  `birth_date` date NOT NULL,
  `role` enum('guest','waiter','admin','manager') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `img_url` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `display_name`, `password_hash`, `salt`, `legal_name`, `birth_date`, `role`, `created_at`, `img_url`, `updated_at`) VALUES
('12e1a649-7d6d-4ca5-bab9-0b31ec22340c', 'string', 'string@string.string', 'string', '+Z71TpMlJpxsLw8L+NEOojb8a5r3AmJ8GOrJ3O5cmoo=', 'aw8k+DZUegM/l+EYG9s7mg==', 'string', '2025-01-13', 'guest', '2025-01-13 08:34:56', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c.webp', '2025-03-23 14:59:22'),
('1de8b8ff-1117-4204-9810-a74839453e4c', 'domi', '', '', 'h4hJaFOOrL/Gwmx8nz8D3xzKLDUfGq5p0N0XzvJydYw=', 'KCkFiQGM9H8c2Rt7ygbugA==', 'domonkos', '2002-05-25', 'guest', '2025-01-15 07:58:03', '1de8b8ff-1117-4204-9810-a74839453e4c.webp', '2025-02-14 10:34:04'),
('1e977aa5-ddca-4874-91e3-35520b593a68', 'Chewie', 'pa-po@freemail.hu', 'Chew Bacca', 'QRvOotFKU6Z2iJ5uu2gah0EBu8ptzfTyi6tz2ZiKBlM=', '/e5osxZ19qxyFehs0eZ7zw==', 'Chew Bacca', '1977-05-25', 'guest', '2025-03-21 14:43:02', '1e977aa5-ddca-4874-91e3-35520b593a68.webp', '2025-03-21 15:43:02'),
('1fed351a-16ba-4d57-a7b5-39c46d280806', 'BartosVagyok', 'nokivagyok69420@gmail.com', 'Bartos István', 'LH9XPDm2Pp0eE7a1JSveLwsfiV9vLzOYeTSjSJ0qhI0=', 'cfSEMuE8YycMBY70qB5qcQ==', 'Bartos István', '2006-01-05', 'guest', '2025-03-10 09:43:18', '1fed351a-16ba-4d57-a7b5-39c46d280806.webp', '2025-03-10 10:43:18'),
('28c9767c-cc7c-4948-836a-512a749df074', 'admin', '', 'admin', 'nsy8ml0Wz1wa3gWC1R+du0VkHy8ccYiid4b6awy/n2A=', 'RrGi3jPV2R6afZfbqv5snA==', 'John Admin', '2000-01-14', 'admin', '2025-01-14 17:04:45', '28c9767c-cc7c-4948-836a-512a749df074_5f1a25b7-1c27-4929-9f90-ff43c22de2d5.webp', '2025-04-03 09:07:02'),
('2e36c0fa-8d28-49e7-9543-faec2e399809', 'Htmlfinalboss', 'htmlfinalboss@gmail.com', 'Htmlfinalboss', 'GEaXe7dKb8jyEPfihQ89dW/G+IfBBlM1O8fQmtAb/n0=', 'qE22stPfMkPy/ZrDi9wQxQ==', 'Htmlfinalboss', '2001-09-11', 'guest', '2025-03-20 07:11:51', '2e36c0fa-8d28-49e7-9543-faec2e399809.webp', '2025-03-20 08:11:50'),
('36a335ac-aba6-48bb-8f99-549a91828c4f', 'tokentest', '', '', 'g7cp/qFR+NX2gtfpg1zACW3WD0XcgPuYIFEvm2FZUGU=', 'BowW9a8r60Z3hGKAkR7ONA==', 'Ez egy token teszt', '2025-01-09', 'guest', '2025-01-09 14:24:42', '36a335ac-aba6-48bb-8f99-549a91828c4f.webp', '2025-02-14 10:34:04'),
('372b441d-2456-4c88-9146-f26a79c238ed', 'gyozo', '', 'Gáspár Gyozo', 'YvrtR01Iz8ppEKZUYhTgf7Rj7x+on5nsum8eoIQycSE=', 'eC9+o6OE0wAJMWy/95QGMA==', 'Gyáspár Gozo', '2002-09-20', 'guest', '2025-01-18 17:59:23', '372b441d-2456-4c88-9146-f26a79c238ed.webp', '2025-02-24 07:14:12'),
('377a77ff-dcee-4668-b31a-9c2f37a93178', 'gabi', '', 'gabor koloszvari', '0owTgWUkCo+KcIBmMD5+dfXKkbQoBMU13F8f+4zhQAM=', '+3A//dIuUdleW/3eVJCB9A==', 'gabor koloszvari', '2003-02-21', 'guest', '2025-02-18 20:43:35', '377a77ff-dcee-4668-b31a-9c2f37a93178.webp', '2025-02-18 20:43:35'),
('3890fc3f-42ce-432a-ac19-ad665f39a976', 'manager', 'manager@manager.manager', 'John Manager', 'cK30InUM7JHJtBg/QFqPgdj0RQeaJPjWGoS6LsAA7VQ=', 'W27yzk9z1Sn7+4J7mgR4/Q==', 'John Manager', '2000-02-21', 'manager', '2025-02-21 08:13:18', '3890fc3f-42ce-432a-ac19-ad665f39a976_bd6dc375-9b93-4fed-9d5c-4c940737d2bd.webp', '2025-04-01 16:24:13'),
('3a018d16-c6ea-458c-8be7-a646fbd70b82', 'Regjanos', 'emailcimjanos@gmail.com', 'Regjanos', 'VAdI/eyAIwVpoc8ceSOOSpwWViHtMGSMs6aaExGgjmA=', '6QH3jeORZ4e/0DMeXsQ+PA==', 'Regjanos', '2000-03-15', 'guest', '2025-03-28 18:30:04', '3a018d16-c6ea-458c-8be7-a646fbd70b82.webp', '2025-03-28 19:30:04'),
('3b7d8f5f-f61f-4c93-b041-d38cc44f101b', 'longus', 'schwanzus@longus.com', 'Schwanzus Longus', 'RaEDE3lVMfouJuz1CzCjsuucL9AJoLqc38sDtWddIuE=', 'Zv4pJ9PKQbdO+EAuMC+DiQ==', 'Schwanzus Longus', '1999-02-25', 'guest', '2025-02-21 12:01:31', '3b7d8f5f-f61f-4c93-b041-d38cc44f101b.webp', '2025-02-23 15:39:04'),
('3b9087fb-2260-40cd-8a28-08111c518576', 'Jackqen', 'konyacs2002@gmail.com', 'Kónya Csaba', '1d+Wfk4FsyU+Ll1Qm8gXpwDLZx9anGd46eT/iOi9xnI=', 'AvK5x/oaK6+u8P95cXgHQg==', 'Kónya Csaba', '2002-06-18', 'guest', '2025-03-28 10:38:15', '3b9087fb-2260-40cd-8a28-08111c518576.webp', '2025-03-28 11:38:14'),
('4011844d-ef2e-49ea-9e03-89299d646c77', 'testuser07', '', 'testuser07', 'dUIa37P0XX6fKwwAeUBNGJjTmSX4diumj91RK6PaB/U=', 'bNjVDs5x0SdrlBcOw9vzBA==', 'testuser07', '1993-06-16', 'guest', '2025-02-04 10:06:23', '4011844d-ef2e-49ea-9e03-89299d646c77.webp', '2025-02-14 10:34:04'),
('4027a04e-1c54-44cf-8f60-9b2e5d930bae', 'Tibcsi', '', 'Illés Tibor', 'c1uTLBFOGP1U88kPlSux1AsNSloDDKAnacsgL5oQcPY=', 'lShqXK3uEfHINULelNgxcg==', 'Illés Tibor', '2005-10-09', 'guest', '2025-02-08 23:42:41', '4027a04e-1c54-44cf-8f60-9b2e5d930bae.webp', '2025-02-14 10:34:04'),
('467af9a7-453f-417f-9517-fe93a7d2de2c', 'user', '', '', 'AxlvMVDd3Kv0Zm7tmyG0lfjFJKizIA+mI4227ifjNts=', 'XGkxOhR/VL0Iu1kZuHAYMg==', 'Fikusz Kukisz', '1999-01-05', 'guest', '2025-01-10 14:44:12', '467af9a7-453f-417f-9517-fe93a7d2de2c.webp', '2025-02-14 10:34:04'),
('4c38c82e-a398-40f3-b070-0a1c42798c9f', 'Boss', 'nem@gmail.com', 'Bozsgai', 'DlysjY6v1zSZZjfKju30vd5Y9UDznegdurO+C/BOsFQ=', 'uD/8b7lFkB/5CGB7xguUHQ==', 'Bozsgai', '2004-03-14', 'guest', '2025-03-10 09:42:35', '4c38c82e-a398-40f3-b070-0a1c42798c9f.webp', '2025-03-10 10:42:35'),
('52cc119a-dd50-44d9-9fb9-d1daf2f0202a', 'johnstring', '', '', 'XxCtfCntVVHjwQGEeluCTJRnRFv2ZsRvOGmGg0RwnIw=', 'pWicQe1wDLeZXG1T+jUZMQ==', 'string', '2005-01-15', 'guest', '2025-01-15 19:42:50', '52cc119a-dd50-44d9-9fb9-d1daf2f0202a.webp', '2025-02-14 10:34:04'),
('52dd411d-1693-490d-9779-7773a071b117', 'mostjo', '', '', 'RtP1yEzZunPK13QN+ww/QFE0jrggPzDol37gJpm/AzU=', 'Wwk90/8N7JzfAZg1oRc57w==', 'string', '2025-01-14', 'guest', '2025-01-14 16:28:11', '52dd411d-1693-490d-9779-7773a071b117.webp', '2025-02-14 10:34:04'),
('594202c5-186f-4006-acfc-e23277fc48f1', 'friend2', '', 'friend2', 'E+CFmbqnjQjH25amT/7+uaZ+jtcLY4mzTPJh0QTCfR4=', 'QAg3CxMKC/HdEVAe1Ed2WQ==', 'friend2', '2000-01-01', 'guest', '2025-02-14 10:00:12', '594202c5-186f-4006-acfc-e23277fc48f1.webp', '2025-02-14 10:34:04'),
('59b0053a-dfbb-477d-b01d-17c486ed8719', 'ngabor419', 'ngabor419@gmail.com', 'Négyesi Gábor', 'OIOuLbWtgY/fqdcfmFjTrU78RctWvtUKpKABz8Wf3sI=', 'v2082KX3ke2Wv9zIC2DUAg==', 'Negyesi Gábor', '1995-03-15', 'guest', '2025-03-21 11:07:48', '59b0053a-dfbb-477d-b01d-17c486ed8719.webp', '2025-03-21 12:13:07'),
('5e756c65-a9bf-44a8-9ef6-06ac5c4afb77', 'vizsga01', 'vizsga@email.cim', 'Vizsga Felhasználó', 'gF0/lLvhG81v1miLsekbZ4PT5QP27OI58iDfqW2MS8M=', 'EEqOsGwyo8DvZ29zocojdA==', 'Vizsga Felhasználó', '2000-01-01', 'guest', '2025-04-03 10:22:36', '5e756c65-a9bf-44a8-9ef6-06ac5c4afb77.webp', '2025-04-03 12:22:36'),
('5eb9ed85-df1b-45a8-956c-be289a79bfe4', 'Luccolia', 'm.vivien044@gmail.com', 'Mészáros Vivien', 'h1zxq5/Imm3K/gK/HEtFAdvhrjI0vDXb9qU7Xb6abns=', 'q/zqGfrdMRdCN2qBqgy2zg==', 'Mészáros Vivien', '2005-10-18', 'guest', '2025-04-02 16:00:35', '5eb9ed85-df1b-45a8-956c-be289a79bfe4.webp', '2025-04-02 18:00:34'),
('60d6b130-dd78-401d-ae22-ff910d2de993', 'adminferi', '', 'adminferi', 'BKRtAPGJtYJ23gRrd3S+uNr1GIxo73FXEK32O+NInUo=', 'XvMdAiPlusJyl05crzxkVA==', 'adminferi', '1993-02-10', 'guest', '2025-01-22 21:57:54', '60d6b130-dd78-401d-ae22-ff910d2de993.webp', '2025-02-14 10:34:04'),
('63617d3e-edff-4c33-a6cf-f86170d93161', 'famarko05', '', 'Bíró Márk', 'yjv2+3tUkF3hpdG1uiZmhOi2P2YH2c2V+/MGoFxHmj4=', 'jOtkrbttVdUF3RCKWOSzOw==', 'Bíró Márk', '2005-03-08', 'guest', '2025-02-20 09:41:35', '63617d3e-edff-4c33-a6cf-f86170d93161.webp', '2025-02-20 09:41:34'),
('63989529-55af-4551-9c29-73c1e28c7e61', 'friend1', '', 'friend1', '7ldgDBAzj/xA88482iBoxSNYDuUbGapN5xCMX+SA24w=', 'tlatAvv4/BxWyuutNPfy3g==', 'friend1', '2000-01-01', 'guest', '2025-02-14 09:59:57', '63989529-55af-4551-9c29-73c1e28c7e61.webp', '2025-02-14 10:34:04'),
('64e5cf24-dd49-4b74-8435-420283f8ee83', 'jwt', '', '', '7STAnwVo2FKKa0xBW+t/oQMQGvhkcevkQKtha4hnvpA=', 'x0PSIFd5naA+XxamqokoSQ==', 'string', '2025-01-10', 'guest', '2025-01-10 07:40:04', '64e5cf24-dd49-4b74-8435-420283f8ee83.webp', '2025-02-14 10:34:04'),
('66e89804-31fe-4b3d-83bf-655cc5998265', 'Yetee', 'xyetee@protonmail.com', 'Juhász Pèter', 'KXT8lvb0ObUYkAd4FXd5SSEfUYHqVQSQYTtAAXpsiiI=', '/yqN9j4sFLyzFbpzMuJFmw==', 'Juhász Pèter', '1979-07-06', 'guest', '2025-03-16 14:13:25', '66e89804-31fe-4b3d-83bf-655cc5998265.webp', '2025-03-16 15:13:25'),
('67d7581e-4569-4eaf-ba0d-fce71a94e120', 'MC Zsolti', '', 'Gáspár Zsolt', 'lhgvc97LeiJTgW2cyLYo1iMpOWVKmRkgJMt6qKQu5mc=', 'voj4Z5BeSvJSkDMU9JA2yg==', 'Gáspár Zsolt', '1981-02-10', 'guest', '2025-01-18 18:17:31', '67d7581e-4569-4eaf-ba0d-fce71a94e120.webp', '2025-02-14 10:34:04'),
('6deefe2c-179f-465a-8062-771cfb204d33', 'fakju', 'asd@210.h', 'janoska', 'Hv8fwLRA9rN6Zynm6qerc+EoWZYZVt8ONxAh/NYJhM4=', 'yrnZcw1QpEczIHCP2X+trQ==', 'janoska', '1994-07-29', 'guest', '2025-02-26 14:14:02', '6deefe2c-179f-465a-8062-771cfb204d33.webp', '2025-02-26 15:14:02'),
('730a8fcb-7165-4242-b794-f60f7f5bc869', 'Peti a csibész', 'mecseip@kkszki.hu', 'Csup Ati', 'kkYhtJzXfcULJBBEqXq6rl9lY6J3IxS0PUWd0fxA3M4=', 'sywde0UYluOtuON9tQnM6A==', 'Csup Ati', '2003-12-16', 'guest', '2025-03-16 16:45:15', '730a8fcb-7165-4242-b794-f60f7f5bc869.webp', '2025-03-16 17:45:15'),
('7ddea88b-8a12-406c-b5ad-9cc388d38417', 'teljesnev', '', '', 'uvJOwITp66DTGB5iBMJVkTlUoq7ZKDSAP8yG/x0ZNr4=', 'aGFQCyuLxjSBSCUTw5YB/Q==', 'Teljes Nev', '2001-01-01', 'guest', '2025-01-15 07:50:06', '7ddea88b-8a12-406c-b5ad-9cc388d38417.webp', '2025-02-14 10:34:04'),
('8007a9aa-dc06-43cc-8e0f-7fed06bcfc75', 'tester', '', '', 'tE9g6vFwE2P1aHFO9kUBL0WMFV9hTcqKqumepFlXWsI=', '47N+PYLJmuxflkB/Aq2qUw==', 'string', '2025-01-09', 'guest', '2025-01-09 14:15:26', '8007a9aa-dc06-43cc-8e0f-7fed06bcfc75.webp', '2025-02-14 10:34:04'),
('88edc429-ec37-46ba-8a40-39ca4ad46f51', '123123', 'wadwa@gmx.hu', '123123', '1A2NxpLhXE2PEShHPfFWgJ+dOXPhWXqmzAp09uM4R18=', 'Xg3OheeZnjM2eZ/04SMViQ==', '123123', '1991-03-12', 'guest', '2025-03-27 21:31:52', '88edc429-ec37-46ba-8a40-39ca4ad46f51.webp', '2025-03-27 22:31:52'),
('9045a756-2571-43a6-aa99-817c5c4eee25', 'Zoli', 'bagesz.73@freemail.hu', 'Ágoston Zoltán', 'jWET/8oXoQHu4GwxqP3pDVkFopvj3ecbhNSrLwotVQI=', '+X3UdEpkltt7JNHDYRdB2g==', 'Ágoston Zoltán', '1973-07-14', 'guest', '2025-03-07 14:59:18', '9045a756-2571-43a6-aa99-817c5c4eee25.webp', '2025-03-07 15:59:17'),
('98d74809-b74a-4a95-ab03-ca37ab107506', 'testusername', '', 'TESZT', 'YkrBNWr8+qggOdtXprbVkhl5dEnVRoTc3bRbN8apVqY=', 'lWpchfEUH5va4n0Wn44qgQ==', 'TESZT', '2003-06-19', 'guest', '2025-01-18 14:08:45', '98d74809-b74a-4a95-ab03-ca37ab107506.webp', '2025-02-14 10:34:04'),
('9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d', 'csecs', '', 'csecs', 'X01S9+VPOTfVuS3/RzEd2AGfLGTFne3efdJy7zr8muA=', 'B6Blt3DTupi7/H7dbI51IQ==', 'Pepsi Béla', '2004-06-23', 'guest', '2025-01-10 14:12:28', '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d.webp', '2025-03-18 14:58:38'),
('9d59a117-ce83-4c29-a2d5-7360daab1c8a', 'krzsnmrk', 'krizsanmarkg@gmail.com', 'Krizsán Márk Gábor', 'B5RsynQgD+tPFQC2Jlz2/gF8QmN9h6MBVcLMbA/wKxE=', 'v0kDw4l6tkAzfR9zqT+G1A==', 'Krizsán Márk Gábor', '2005-06-29', 'guest', '2025-03-25 09:47:59', '9d59a117-ce83-4c29-a2d5-7360daab1c8a.webp', '2025-03-25 10:47:59'),
('9d8dc924-2ca1-45ca-9d1f-d83c48f2ab24', 'asdasdasd', '', '', 'ODm8SMAjnyryt+sXXohuk3jdJbfn38Ljgb5Iafuo5t8=', '/TR2ECulNjsuVFOa5j8uNA==', 'tanarur', '2002-05-25', 'guest', '2025-01-15 11:55:40', '9d8dc924-2ca1-45ca-9d1f-d83c48f2ab24.webp', '2025-02-14 10:34:04'),
('9eaa68e2-25fc-4e9a-a1a8-2f8cb7e82d11', 'pepe1125', 'pepe1125@gmail.com', 'Sándor Péter ', 'KK/77bHwx1Lv1NCtdCePmh3atmDjZyn2QY6SEQdVYxE=', '6k3CaNGMPYJevhedtmvOhw==', 'Sándor Péter ', '1983-11-25', 'guest', '2025-03-16 20:20:31', '9eaa68e2-25fc-4e9a-a1a8-2f8cb7e82d11.webp', '2025-03-16 21:20:30'),
('9fbe5809-7b34-4f67-a114-99cedceb177a', 'fingusz', '', 'Foltisszima Fingusz', 'ah8q/I6gmLTK24YcCZ4fwpplZ9oXQbjNvniSftSx6WQ=', 'T3aACapU/S8gGT4oaYAs5g==', 'Foltisszima Fingusz', '1791-06-16', 'guest', '2025-02-17 08:01:46', '9fbe5809-7b34-4f67-a114-99cedceb177a.webp', '2025-02-17 08:01:45'),
('a4aeae77-6cf7-4ce1-9cea-9bb14ff8ebe7', 'kgbela', '', '', '6Mgcd6UQbiSVOGW8pb75FPOP8knWRoKf21TFYmu3t5s=', 'YVIZP8FfmxvCvfQNgIqV/w==', 'KGBéla', '2002-11-15', 'guest', '2025-01-15 12:19:07', 'a4aeae77-6cf7-4ce1-9cea-9bb14ff8ebe7.webp', '2025-02-14 10:34:04'),
('a7482c8f-ceb4-4bba-abe0-c4bca1096d65', 'Andrea79', 'andi.bolgar@gmail.com', 'Ágostonné Bolgár Andrea', 'JsSTS+EB16U/WwmryPo9AWqjjEG+aQDqNpsosii34Eg=', '8YBYehcZrAWQkh3XiO8ZYA==', 'Ágostonné Bolgár Andrea', '1979-02-19', 'guest', '2025-03-19 08:40:21', 'a7482c8f-ceb4-4bba-abe0-c4bca1096d65.webp', '2025-03-19 09:40:21'),
('b19b36a4-d838-4996-afbb-8d1bc005d308', 'PacekH4CK3R', '', 'fasz fasz', 'L80UZDmNDqUujEK2cPDx1SCXhTxe/2Te4UX8XarRjjI=', 'ic5Zw9lXBcjRKOQlUxX46w==', 'fasz fasz', '2000-02-20', 'guest', '2025-02-03 17:54:45', 'b19b36a4-d838-4996-afbb-8d1bc005d308.webp', '2025-02-14 10:34:04'),
('b3d15650-5a60-4d1c-a2f4-35dc92e824e6', 'Jani12', 'janos@gmail.com', 'Nemet janos', 'gyY61n1YzhfsZiBQQeBPmTv4KhQGcXNvJ6pDVPwXVxo=', '5aCsgJuo/Tcio5IIJQCxAw==', 'Nemet janos', '1980-11-05', 'guest', '2025-04-05 11:50:15', 'b3d15650-5a60-4d1c-a2f4-35dc92e824e6.webp', '2025-04-05 13:50:14'),
('b49f053f-9d59-4359-b9f8-e00a50f5145f', 'asd', '', 'asan', 'lIR67rnedRBmqF48mskslxUsNhzsnhov9AWhFlmLGWs=', 'b3ERZoEbzDnjQKkOGSVvgQ==', 'asan', '1996-06-20', 'guest', '2025-01-18 17:19:07', 'b49f053f-9d59-4359-b9f8-e00a50f5145f.webp', '2025-02-14 10:34:04'),
('b874249e-5f56-4186-bd62-590569fc5a0b', 'string123', 'string123@asd.asd', 'string123', '+5Y1aMP/l9xAx+WEV9Df5e62WMB7JT0kAIG1LG105aM=', 'OS0UJuE3tMIGaJWPFJy3rg==', 'string123', '2025-02-21', 'guest', '2025-02-21 07:15:39', 'b874249e-5f56-4186-bd62-590569fc5a0b.webp', '2025-02-21 07:15:39'),
('b987bdf5-74ce-4c29-b39d-5ecfaecc5026', 'leo', '', '', 'Xj8JghEQJLsvRzSNL733gHGjOCERGLwo9D2gXxyq+AI=', 'WlAysKShCOF0cKrE8o1aVg==', 'leonardo', '2025-01-10', 'guest', '2025-01-10 07:03:09', 'b987bdf5-74ce-4c29-b39d-5ecfaecc5026.webp', '2025-02-14 10:34:04'),
('bab61c73-ad3b-48c3-a6c6-47e19c3df87a', 'admin1', '', 'asd', 'RgjQC+fVRzCmf/uvfk+9hWwOezMWadJ+VUyuo65FtpA=', 'GNckKglJcbp/degCQl7yIA==', 'asd', '1990-06-21', 'guest', '2025-01-19 14:29:15', 'bab61c73-ad3b-48c3-a6c6-47e19c3df87a.webp', '2025-02-14 10:34:04'),
('bba54a66-7e71-4e14-98e0-8f435e0b2f7b', 'Kurvaanyad', '', 'Kristóf György', 'BXolCs5zZ2wdAC1GUHnYDIT6xeTM1nhkPtE/DV+kMg0=', 'g5aw9/j8ggBY0qmkQjOuvw==', 'Kristóf György', '2005-02-02', 'guest', '2025-02-08 23:42:13', 'bba54a66-7e71-4e14-98e0-8f435e0b2f7b.webp', '2025-02-14 10:34:04'),
('c6ea640d-fa2b-4b23-bef2-b05baa25eba4', 'Cocco', 'rekellemail5@gmail.com', 'Hegyi', 'tjJf2RjzEdM4zNXJyUSINlNJWynYEi1GaUq/0IXcFpY=', 'Mn7bc8IfJcrtKOwJFg1xpw==', 'Hegyi', '2003-03-17', 'guest', '2025-03-16 16:43:36', 'c6ea640d-fa2b-4b23-bef2-b05baa25eba4.webp', '2025-03-16 17:43:36'),
('c8c39e65-4e20-4dda-b1bd-afc4fe530bc7', 'felidomanager', 'manager@felido.hu', 'Félido Manager', 'Ep9wpyQpII76Yp2Fyzothaf92bYS+ZobfN9BhPXv6yY=', '9yNncB/pvsEaq4WtCuWPnw==', 'Félido Manager', '1000-01-01', 'manager', '2025-03-06 06:54:43', 'c8c39e65-4e20-4dda-b1bd-afc4fe530bc7.webp', '2025-03-06 15:56:37'),
('ca206937-9dde-444d-ae71-3bd04f6113ef', 'zack', 'zackwoodward@icloud.com', 'Zack Woodward', 'Brejp60hNWSioJ+y8aBA1nEYOgSclyE590RW4I9iaMg=', 'R3tAu1l4Mn7CBJLuhI/nTA==', 'Zack Woodward', '2005-12-03', 'guest', '2025-03-12 12:37:22', 'ca206937-9dde-444d-ae71-3bd04f6113ef.webp', '2025-03-12 13:37:22'),
('d7e197e3-622b-47d5-96ba-445ecbbdc3bb', 'CsaposJanos', 'hekdadd@gmail.com', 'Csapos János', 'phd5tJeYL1izlqKCUnPlLrPgBmMW6f3ONCb6/hwg0zg=', 'ajk48RaugPKIwSHoZWqEQA==', 'Csapos János', '1905-05-04', 'guest', '2025-02-25 09:06:27', 'd7e197e3-622b-47d5-96ba-445ecbbdc3bb.webp', '2025-02-25 10:06:27'),
('dcbf0db3-4e60-4faf-8a4e-f553dd026771', 'kaszalr', 'kaszlr@kkszki.hu', 'Kasza Róbert', '5uQ8zDtbLC7w5n7MCHaaEvhJ6T2EsiNEBL8kCOQEBG0=', 'BOYBLDu77gYyN2n4tEEJ6Q==', 'Kasza Róbert', '1973-10-10', 'guest', '2025-03-19 11:22:27', 'dcbf0db3-4e60-4faf-8a4e-f553dd026771.webp', '2025-03-19 12:22:27'),
('dcfa5a52-bd52-4f5d-9050-a3fe3691cc0b', 'namegy', '', '', 'MguXySR4IQl79CO9ZM+6oLxGdYWmfTmO8Wedv/KaTD0=', '23Diy0tE83EUMfdS6CaBaA==', 'string', '2025-01-14', 'guest', '2025-01-14 16:16:13', 'dcfa5a52-bd52-4f5d-9050-a3fe3691cc0b.webp', '2025-02-14 10:34:04'),
('dd7af3ea-42b3-4969-b586-6b185a8b32e6', 'nomon', '', 'Celesztin', 'EmPUpHxPICRICvgueG+Oy9ddYx1eCi/GCpGADBQ1VcA=', 'z5R4Hxm78MlQ4gYJFS1EGA==', 'Celesztin', '1996-07-01', 'guest', '2025-02-03 17:55:24', 'dd7af3ea-42b3-4969-b586-6b185a8b32e6.webp', '2025-02-14 10:34:04'),
('e4171b14-4e95-44f7-9228-f6aaf3630143', 'gabogabi', 'gaboro.gabi@gmail.com', 'Gaboronyecz Gábor', 'OvNuurDCnk3fqN9CnPSgneCB2P+c6eCjV3x0WoZK5Vo=', 'S03vTd4irbeqc+qJQwgl/w==', 'Gaboronyecz Gábor', '1998-02-14', 'guest', '2025-02-25 09:05:27', 'e4171b14-4e95-44f7-9228-f6aaf3630143.webp', '2025-02-25 10:05:26');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `achievement_id` char(36) NOT NULL,
  `achieved_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_friendship_pair` (`user_id1`,`user_id2`),
  ADD KEY `fk_friendship_user2` (`user_id2`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location_ratings`
--
ALTER TABLE `location_ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rating_user` (`user_id`),
  ADD KEY `fk_rating_location` (`location_id`);

--
-- Indexes for table `manager_mapping`
--
ALTER TABLE `manager_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_manager_mapping_user` (`user_id`),
  ADD KEY `fk_manager_mapping_location` (`location_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payments_user` (`user_id`),
  ADD KEY `fk_payments_order` (`order_id`),
  ADD KEY `fk_payments_table_booking` (`table_booking_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IX_RefreshTokens_Token` (`token`),
  ADD KEY `FK_RefreshTokens_Users` (`user_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `table_bookings`
--
ALTER TABLE `table_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`,`booker_id`),
  ADD KEY `table_bookings_ibfk_1` (`booker_id`);

--
-- Indexes for table `table_guests`
--
ALTER TABLE `table_guests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `fk_achievement` (`achievement_id`);

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
  ADD CONSTRAINT `event_attendance_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendance_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `fk_friendship_user1` FOREIGN KEY (`user_id1`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_friendship_user2` FOREIGN KEY (`user_id2`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `location_ratings`
--
ALTER TABLE `location_ratings`
  ADD CONSTRAINT `fk_rating_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `fk_rating_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `manager_mapping`
--
ALTER TABLE `manager_mapping`
  ADD CONSTRAINT `fk_manager_mapping_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_manager_mapping_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`booking_id`) REFERENCES `table_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_payments_table_booking` FOREIGN KEY (`table_booking_id`) REFERENCES `table_bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `FK_RefreshTokens_Users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `table_bookings`
--
ALTER TABLE `table_bookings`
  ADD CONSTRAINT `table_bookings_ibfk_1` FOREIGN KEY (`booker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `table_bookings_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `table_guests`
--
ALTER TABLE `table_guests`
  ADD CONSTRAINT `table_guests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `table_guests_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `table_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `fk_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
