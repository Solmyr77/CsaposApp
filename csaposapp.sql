-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jan 17, 2025 at 10:17 PM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance`
--

CREATE TABLE `event_attendance` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `event_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `description`, `address`, `capacity`, `number_of_tables`, `rating`, `is_highlighted`, `is_open`, `created_at`, `img_url`) VALUES
('5ecdf8ff-8bf5-4cc1-98eb-c8af87faf4cd', 'City Pub', 'Egy kocsma a város szívében', '', 80, 16, -1, 0, 0, '2024-12-26 03:20:59', 'string'),
('9c458b82-7eb9-4fc9-a198-784245d13425', 'Sörpatika', 'Egy kulturáltabb kocsma a városban', '', 60, 12, -1, 0, 1, '2024-12-26 03:21:10', 'string'),
('af0ed771-1410-472f-a334-bef3f124ae5f', 'Ez egy teszt hely', 'Ez meg egy teszt leírás', '', 100, 10, -1, 0, 1, '2025-01-17 19:30:27', 'string'),
('c6276e02-67f8-45e1-ba7a-6271a93bea02', 'Alt lány hely', 'Mi mást kell mondani?', '', 20, 4, -1, 0, 1, '2024-12-26 03:21:45', 'string'),
('cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Félidő Söröző', 'Egy csendes kocsma egy csendes faluban', '', 40, 8, -1, 0, 1, '2024-12-26 03:20:38', 'string');

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
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `discount_percentage` int(11) NOT NULL DEFAULT '0',
  `stock_quantity` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '0',
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `location_id`, `name`, `category`, `price`, `discount_percentage`, `stock_quantity`, `is_active`, `img_url`) VALUES
('875695ab-a760-486a-a801-9b052c8738b7', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Ez egy teszt termék', 'drink', 1000, 0, 10, 1, 'drink/875695ab-a760-486a-a801-9b052c8738b7.webp'),
('ac107756-f63c-4538-b4cc-91fc0cad6d82', 'cbdd928f-5abb-4a0b-9023-0866107cfa9a', 'Finom ital', 'drink', 2660, 0, 24, 1, 'drink/ac107756-f63c-4538-b4cc-91fc0cad6d82.webp'),
('c5d2b92e-c78f-4bf0-8504-154f033a8898', '5ecdf8ff-8bf5-4cc1-98eb-c8af87faf4cd', 'Finom burger', 'food', 1299, 0, 100, 1, 'food/c5d2b92e-c78f-4bf0-8504-154f033a8898.webp');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiration` datetime NOT NULL,
  `is_revoked` tinyint(1) NOT NULL,
  `user_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `token`, `expiration`, `is_revoked`, `user_id`) VALUES
('007ca5d3-dfae-4338-9a73-8de96fc94c99', '5f2d20593e2f4c04aaf8aba80d612210e355e5ffaac147cd9fbc475e9689d662', '2025-01-24 22:15:29', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('07da2aee-9cd2-4423-8cb7-5cf504f296bb', 'dd16ed9524214f6baaa2e52979d8a9065694c03bed1845e194cc1a4f09ecb6a6', '2025-01-23 08:26:50', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('18157396-2f68-40a4-848b-e16beafba5de', 'd8fef95ee69a4c398987578e5a1594d6a6d1c7df10944cfd9ff1838d07fc4746', '2025-01-23 09:39:05', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('1b65ea38-3e15-4595-8526-5a76a293d529', '85924cd8c75c45d782ee2bfdb04577863e0dfe19c06e42f8b7f86fe5153fbfd5', '2025-01-22 19:43:14', 1, '52cc119a-dd50-44d9-9fb9-d1daf2f0202a'),
('20c7ca6c-e1fc-49a0-94a8-2ef76b2db58e', 'b887d2be42ef4619955bbb75f3a28b0866e55b80c6224f758b1ccc9a2b40d56c', '2025-01-23 20:15:52', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('23a6fef0-455a-4dc9-b9cb-e929f80cde32', '6557818a609749eca58f316141cde0076ed087bcc38b4d00b634886ee9009b3b', '2025-01-23 07:13:49', 1, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('3a5fbc14-a2dd-469c-b3af-fbc00e788026', 'a870731fc76a4055ad2225c650019888c7d57819f6114c90a97155fe83a3a313', '2025-01-23 08:16:00', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('3a9a956a-593a-4082-8d00-7edbffdd46da', '844e1104e8634e71b72fdfe22fabadf930f9c974b43b4d2baa57c8a24ca9a919', '2025-01-22 20:20:03', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('3be99297-aced-4f41-a72b-9c2ef003135e', '8db9c20db6714e8db3e3473688da82bd132f9dfa05194f34953b1c5e3ad562fc', '2025-01-23 07:09:03', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('3ca1a0c0-78b3-4dcd-b77b-a68c7b5a384f', '89e8781d9677460ea9f6a38be5468694deb951f7beef4f0aa7a14ec5dbc57c15', '2025-01-23 07:15:24', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('42818f77-1c16-4d5b-9a4a-88f0088b6fb9', '274fc2436f674eba8b51cef26abfc6159526e424556240a1b9003f66ede4a9ea', '2025-01-24 09:15:01', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('4e39f5cf-b996-485e-a19f-34820271c1e9', 'b03fc1a32d424befa48f050c0d36cfccba008d6bfde04b1da66914697693f13b', '2025-01-22 21:13:41', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('5222daed-f44c-478a-b410-c773081818a9', '51dc574dd7074d7e8c4f7834ee1bba2065f41c5e23f348e99742eb0b7c37f8ee', '2025-01-22 21:31:26', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('5a4839a2-27c5-4d1e-87bd-178612c06848', '853c77a5a8244434bf745bcca4165f1cedb1383a15334f2d8088b5816d053bdd', '2025-01-24 08:55:34', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('665fd1be-2ff2-4962-a659-f56f749bd1f0', '443f54b6c38345bab92a97430e622062a2f68828690c40089d067b75f2b93f9b', '2025-01-23 08:24:50', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('79ec1b53-805d-4617-9553-9bb58ef59ebe', 'f6b29020a74d4d05be497e76b46707b7d992154c783b4cfca1dfe71610677cd5', '2025-01-22 20:31:41', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('81224146-e6c6-41d9-8312-4c9a75f9c9e0', '66dc558db8de4b6f8770f314d3fd05b4eee08bdf70be416483e8e4b9ed6a0351', '2025-01-22 19:57:00', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('837997a3-9d7f-4ac8-9fea-b9bd6a8364de', 'b7fd4741293f4fd2b82f93e33f101aa85f43875aa02e41e2a30033d5fa59ebbf', '2025-01-23 06:43:28', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('88963040-b1dd-45a1-80cf-b911a1c0bad2', '33bbb6defaa14c3895be85e08da7bd95a5b0871663c4412b8769ad4d2389d406', '2025-01-23 07:15:32', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('98e625d8-6fb0-479c-bc1c-cb009bd3002c', '15f2ff81f0a04f45a8cb133ec4949ab3ac97b1aee7694f5b803d03fa2f71aa74', '2025-01-23 09:41:15', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('9ae20021-2872-4328-8f54-89ca080d3771', 'defa3f7c2eb040288fce6df3f9f1467bb5ad336ca4eb469ab0d64a71845400fd', '2025-01-24 12:43:29', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('a4240f3a-efc0-4ca4-b8d2-61ba8cf9ab97', '5349f8a7dcc94728a1981d591c7fd3ebbed63f28dd4345b280c251ec3f014210', '2025-01-23 09:57:10', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('a9616c42-db6a-4a19-908e-d389c33bc0bf', '786f7e99c03d4da0b530f252085f3c73ab2c22cd88294a81976d8809425d562a', '2025-01-23 09:57:10', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('aa212dc3-77e2-447e-b06a-97d7d3ec99bb', '253b2520eb644d39bb70f66d617606da7a4ed912a2a94ee0bc5161e81e07d863', '2025-01-23 06:43:10', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('b0de6823-ad5d-44c7-a50b-f39e8d5cb892', '4be02e81d0084ebb8edd46e4d1daa2ad851c9e2ab88543019ede7999efa3e87e', '2025-01-23 09:57:10', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('b47f7f05-8aaa-4121-be4e-7261b7bb5683', 'e63cdf705cc046b395786fa31ba0aff3ae717ecc7ae94681b8b830220fb063a7', '2025-01-23 08:16:56', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('b62c0883-2be7-4fea-af6e-04bf00472ffa', '84eff868d2374a5fa0334c7cd1c9327d5ad03a34c516439780c3baed2b43b4a4', '2025-01-23 07:14:34', 0, '28c9767c-cc7c-4948-836a-512a749df074'),
('c23fe6ba-8b98-451a-a734-a232f035e48b', 'd6620de7201e4c098f418aaa033570f9e44953b355f644c0b9badef2b3c0c594', '2025-01-22 19:53:59', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('c4a10bef-cd2d-4596-8052-c6dd30740245', '579a9019f76441ef96d6a1b88d048e0e0b43981b17fa48a59a1d6acfeee0e031', '2025-01-24 12:42:57', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('c73a3e97-064e-44b5-a3dc-a470390e84c7', '886f9caa1c6c4fb0964397acf7deedf341e7d34f8d124009867fe71a0f3f6c93', '2025-01-22 21:05:50', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('c98bea73-fd5c-42b6-8304-b486d95c0e4b', 'c6ea6787fa3742ccbdd787426d19fae4b050ed0aac914129865ccc402ccebe19', '2025-01-23 09:40:10', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('d1ebb3d6-be74-4400-aa95-2d466df0441c', 'e7bf84ef9939454fa717f3cdbc9158eb26f70e09cbd94bcaabf8c9a79ac828c3', '2025-01-23 10:07:21', 0, '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d'),
('d950c538-face-47a2-a646-99c082ede180', '242e17ae7ec14370b89c3f2bde6982a4e13286a1625d4d169d0e81b7ead03ce4', '2025-01-23 07:47:02', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('e084956a-cee4-4bc1-ab4f-52617a8b648c', '75078855a7b7425b9e917f661c32369bd9eff2cfaa2c43678f5504549eac1578', '2025-01-23 08:54:11', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('e181dde5-49d8-42d8-be7d-243b6a717079', 'ae7ac6419ff5414c96f65e171fed674a736a6071996644ed9d7e58d5be6e73d0', '2025-01-24 08:44:03', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c'),
('e277c462-8872-4b17-be31-13965a10c2e8', '92432b525593466db68dda5dda8e7f7e70e09d8406824658888c1f24b9179088', '2025-01-24 18:30:16', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('f75cc70b-022b-424f-9ac8-a1da1ff025f9', '6479faa908904027a428d89de00b1ec13e17c54531fd4dcabf70a47ed6d5cb52', '2025-01-23 07:13:19', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('facc4ce0-3408-44a7-aea1-e76af6c5d7d0', 'f15ef6d2f85449b6b15268236e1011b1ad544ba5fcfe48548f127b96e2903f7a', '2025-01-23 09:41:43', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('fc37022e-2e7c-488d-b779-efb0e2c74102', 'f56f95d47c5c4689bed02136d8a7b04049862ad2694c4eb4b4e3ae23cef4892d', '2025-01-24 18:23:44', 0, '12e1a649-7d6d-4ca5-bab9-0b31ec22340c'),
('fd49c29c-0a27-4167-9715-1a189a705e7f', '40053f8797ee48299214d895c412de71a66f5d22d8a7494c9c087cbaa569d062', '2025-01-22 20:36:16', 0, '467af9a7-453f-417f-9517-fe93a7d2de2c');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` char(36) NOT NULL,
  `number` int(11) NOT NULL,
  `capacity` tinyint(4) NOT NULL,
  `is_booked` tinyint(1) NOT NULL,
  `location_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `table_bookings`
--

CREATE TABLE `table_bookings` (
  `id` char(36) NOT NULL,
  `table_id` char(36) DEFAULT NULL,
  `booker_id` char(36) DEFAULT NULL,
  `booked_from` datetime DEFAULT NULL,
  `booked_to` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `table_guests`
--

CREATE TABLE `table_guests` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `booking_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(20) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `legal_name` varchar(50) NOT NULL,
  `birth_date` date NOT NULL,
  `role` enum('guest','waiter','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `display_name`, `password_hash`, `salt`, `legal_name`, `birth_date`, `role`, `created_at`, `img_url`) VALUES
('12e1a649-7d6d-4ca5-bab9-0b31ec22340c', 'string', '', '5TctpsGtoWEuPxhYp2QWzdz0O+SyA9kJKmFyUk8RjfY=', 'dDF2q2OljgL6ZuLEmKRn+A==', 'string', '2025-01-13', 'guest', '2025-01-13 08:34:56', '12e1a649-7d6d-4ca5-bab9-0b31ec22340c.webp'),
('1de8b8ff-1117-4204-9810-a74839453e4c', 'domi', '', 'h4hJaFOOrL/Gwmx8nz8D3xzKLDUfGq5p0N0XzvJydYw=', 'KCkFiQGM9H8c2Rt7ygbugA==', 'domonkos', '2002-05-25', 'guest', '2025-01-15 07:58:03', '1de8b8ff-1117-4204-9810-a74839453e4c.webp'),
('28c9767c-cc7c-4948-836a-512a749df074', 'admin', '', 'XSk0BXyzRSNExEJv6mLFSPZM4c9doT0teboqXbVb3EI=', '8ZPXDaL/2JNPzw2jh0mHgw==', 'John Admin', '2000-01-14', 'admin', '2025-01-14 17:04:45', '28c9767c-cc7c-4948-836a-512a749df074.webp'),
('36a335ac-aba6-48bb-8f99-549a91828c4f', 'tokentest', '', 'g7cp/qFR+NX2gtfpg1zACW3WD0XcgPuYIFEvm2FZUGU=', 'BowW9a8r60Z3hGKAkR7ONA==', 'Ez egy token teszt', '2025-01-09', 'guest', '2025-01-09 14:24:42', '36a335ac-aba6-48bb-8f99-549a91828c4f.webp'),
('467af9a7-453f-417f-9517-fe93a7d2de2c', 'user', '', 'H8QGuK75/8RFh/ruAMdGT6VTd8554quZD/56dVrGpoo=', 'OnkfGmJowIz527euDCjqJQ==', 'Fikusz Kukisz', '1999-01-05', 'guest', '2025-01-10 14:44:12', '467af9a7-453f-417f-9517-fe93a7d2de2c.webp'),
('52cc119a-dd50-44d9-9fb9-d1daf2f0202a', 'johnstring', '', 'XxCtfCntVVHjwQGEeluCTJRnRFv2ZsRvOGmGg0RwnIw=', 'pWicQe1wDLeZXG1T+jUZMQ==', 'string', '2005-01-15', 'guest', '2025-01-15 19:42:50', '52cc119a-dd50-44d9-9fb9-d1daf2f0202a.webp'),
('52dd411d-1693-490d-9779-7773a071b117', 'mostjo', '', 'RtP1yEzZunPK13QN+ww/QFE0jrggPzDol37gJpm/AzU=', 'Wwk90/8N7JzfAZg1oRc57w==', 'string', '2025-01-14', 'guest', '2025-01-14 16:28:11', '52dd411d-1693-490d-9779-7773a071b117.webp'),
('64e5cf24-dd49-4b74-8435-420283f8ee83', 'jwt', '', '7STAnwVo2FKKa0xBW+t/oQMQGvhkcevkQKtha4hnvpA=', 'x0PSIFd5naA+XxamqokoSQ==', 'string', '2025-01-10', 'guest', '2025-01-10 07:40:04', '64e5cf24-dd49-4b74-8435-420283f8ee83.webp'),
('7ddea88b-8a12-406c-b5ad-9cc388d38417', 'teljesnev', '', 'uvJOwITp66DTGB5iBMJVkTlUoq7ZKDSAP8yG/x0ZNr4=', 'aGFQCyuLxjSBSCUTw5YB/Q==', 'Teljes Nev', '2001-01-01', 'guest', '2025-01-15 07:50:06', '7ddea88b-8a12-406c-b5ad-9cc388d38417.webp'),
('8007a9aa-dc06-43cc-8e0f-7fed06bcfc75', 'tester', '', 'tE9g6vFwE2P1aHFO9kUBL0WMFV9hTcqKqumepFlXWsI=', '47N+PYLJmuxflkB/Aq2qUw==', 'string', '2025-01-09', 'guest', '2025-01-09 14:15:26', '8007a9aa-dc06-43cc-8e0f-7fed06bcfc75.webp'),
('9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d', 'csecs', '', 'mGI2mlduPBMfa5FjqLwZ/3/Hj4jYPVv9lEDdZck4V7A=', '85gkHdnxfvx22wR+pAEIEg==', 'Pepsi Béla', '2004-06-23', 'guest', '2025-01-10 14:12:28', '9a1c0826-a2b2-47ed-bf7f-1581ba0c7a7d.webp'),
('9d8dc924-2ca1-45ca-9d1f-d83c48f2ab24', 'asdasdasd', '', 'ODm8SMAjnyryt+sXXohuk3jdJbfn38Ljgb5Iafuo5t8=', '/TR2ECulNjsuVFOa5j8uNA==', 'tanarur', '2002-05-25', 'guest', '2025-01-15 11:55:40', '9d8dc924-2ca1-45ca-9d1f-d83c48f2ab24.webp'),
('a4aeae77-6cf7-4ce1-9cea-9bb14ff8ebe7', 'kgbela', '', '6Mgcd6UQbiSVOGW8pb75FPOP8knWRoKf21TFYmu3t5s=', 'YVIZP8FfmxvCvfQNgIqV/w==', 'KGBéla', '2002-11-15', 'guest', '2025-01-15 12:19:07', 'a4aeae77-6cf7-4ce1-9cea-9bb14ff8ebe7.webp'),
('b987bdf5-74ce-4c29-b39d-5ecfaecc5026', 'leo', '', 'Xj8JghEQJLsvRzSNL733gHGjOCERGLwo9D2gXxyq+AI=', 'WlAysKShCOF0cKrE8o1aVg==', 'leonardo', '2025-01-10', 'guest', '2025-01-10 07:03:09', 'b987bdf5-74ce-4c29-b39d-5ecfaecc5026.webp'),
('dcfa5a52-bd52-4f5d-9050-a3fe3691cc0b', 'namegy', '', 'MguXySR4IQl79CO9ZM+6oLxGdYWmfTmO8Wedv/KaTD0=', '23Diy0tE83EUMfdS6CaBaA==', 'string', '2025-01-14', 'guest', '2025-01-14 16:16:13', 'dcfa5a52-bd52-4f5d-9050-a3fe3691cc0b.webp');

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
  ADD KEY `booker_id` (`booker_id`);

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
  ADD CONSTRAINT `table_bookings_ibfk_1` FOREIGN KEY (`booker_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `table_bookings_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`);

--
-- Constraints for table `table_guests`
--
ALTER TABLE `table_guests`
  ADD CONSTRAINT `table_guests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `table_guests_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `table_bookings` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
