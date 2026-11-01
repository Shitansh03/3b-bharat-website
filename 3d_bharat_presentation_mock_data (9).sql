-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2026 at 07:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `3d_bharat_presentation_mock_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `web_presentation_details_all`
--

CREATE TABLE `web_presentation_details_all` (
  `wph_id` int(11) NOT NULL COMMENT '(web_application_header_all.wph_id)',
  `slide_id` int(11) NOT NULL COMMENT 'Unique ID for the slide',
  `slide_type` tinyint(1) NOT NULL COMMENT '1 = Image, 2 = Video',
  `image_location` text DEFAULT NULL COMMENT 'Image file path (/intro.png, /1.png, etc.)',
  `video_location` text DEFAULT NULL,
  `audio_status` tinyint(1) NOT NULL DEFAULT 2 COMMENT '1: yes, 2:no',
  `audio_location` text DEFAULT NULL,
  `slide_status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: active, 2: inactive',
  `seq_number` int(11) NOT NULL,
  `inserted_on` datetime NOT NULL,
  `updated_on` datetime DEFAULT NULL,
  `ideal_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_presentation_details_all`
--

INSERT INTO `web_presentation_details_all` (`wph_id`, `slide_id`, `slide_type`, `image_location`, `video_location`, `audio_status`, `audio_location`, `slide_status`, `seq_number`, `inserted_on`, `updated_on`, `ideal_time`) VALUES
(1, 14, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/1.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/1st%20new%20intro%20image%20audio.mp3', 1, 1, '2026-10-15 12:59:54', NULL, 51),
(1, 15, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/2nd%20image%20-%20task%20for%20ui%20ux%20designer.jpeg', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/2nd%20image%20audio%20-%20what%20actual%20does.mp3', 1, 2, '2026-10-15 12:59:54', NULL, 21),
(1, 16, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/3.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/3rd%20image%20-%203d%20bharat%20approach.mp3', 1, 3, '2026-10-15 12:59:54', NULL, 13),
(1, 17, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/4.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/4th%20image%20audio%20-%203D%20bharat%20methodolgy.mp3', 1, 4, '2026-10-15 12:59:54', NULL, 14),
(1, 18, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/5.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/5th%20image%20audio%20-%20road%20methodology.mp3', 1, 5, '2026-10-15 12:59:54', NULL, 67),
(1, 19, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/6.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/6th%20image%20audio%20-%20bridge%20methodology.mp3', 1, 6, '2026-10-15 12:59:54', NULL, 42),
(1, 20, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/7.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/7th%20image%20audio%20-%20metro%20methodology.mp3', 1, 7, '2026-10-15 12:59:54', NULL, 26),
(1, 21, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/8.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/8th%20image%20audio%20-%20tunnel%20methodology.mp3', 1, 8, '2026-10-15 12:59:54', NULL, 49),
(1, 22, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/9.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/9th%20image%20audio%20-%20road%20deployment%20methodolgy.mp3', 1, 9, '2026-10-15 12:59:54', NULL, 27),
(1, 23, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/10.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/10th%20image%20audio%20-%20bridge%20deployment%20methodology.mp3', 1, 10, '2026-10-15 12:59:54', NULL, 11),
(1, 24, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/11.png', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/11th%20image%20audio%20-%20measurement%20methodology.mp3', 1, 11, '2026-10-15 12:59:54', NULL, 39),
(1, 25, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/images/last%20image%20-%2012th%20image%20-%20task%20submission.jpeg', NULL, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/audios/12th%20image%20audio%20-%20last%20image%20audio%20-%20task%20submition.mp3', 1, 12, '2026-10-15 12:59:54', NULL, 27),
(2, 26, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/images/1st%20image%20-%20python%20developer%20logo.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/audios/1st%20image%20audio%20-%20python%20developer.mp3', 1, 1, '2026-10-15 14:34:22', NULL, 39),
(2, 27, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/images/2nd%20image%20-%20python%20developer%20roadmap.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/audios/2nd%20image%20audio%20-%20python%20developer.mp3', 1, 2, '2026-10-15 14:34:22', NULL, 47),
(2, 28, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/images/3rd%20image%20-%20python%20developer%20you%20should%20follow.jpg', NULL, 2, NULL, 1, 3, '2026-10-15 14:34:22', NULL, 15),
(2, 29, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/images/4th%20image%20-%20python%20full%20stack%20roadmap.png', NULL, 2, NULL, 1, 4, '2026-10-15 14:34:22', NULL, 15),
(2, 30, 2, NULL, 'https://3dbharat.miscos.in/openings/2nd_python_developer/videos/1st%20python%20video%20-%20python%20developer%20roadmap.mp4', 2, NULL, 1, 5, '2026-10-15 14:34:22', NULL, 30),
(2, 31, 2, NULL, 'https://3dbharat.miscos.in/openings/2nd_python_developer/videos/2nd%20python%20video%20-%20python%20developer%20salary.mp4', 2, NULL, 1, 6, '2026-10-15 14:34:22', NULL, 45),
(4, 32, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/images/1st%20image%20-%20marketing%20and%20sales.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/audios/1st%20audio%20-%20%20marketing%20and%20sales.mp3', 1, 1, '2026-10-16 11:37:47', NULL, 41),
(4, 33, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/images/2nd%20image%20-%20%20marketing%20and%20sales.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/audios/2nd%20audio%20-%20marketing%20and%20sales.mp3', 1, 2, '2026-10-16 11:37:47', NULL, 12),
(4, 34, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/images/3rd%20image%20-%20marketing%20and%20sales.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/audios/3rd%20image%20-%20marketing%20and%20sales.mp3', 1, 3, '2026-10-16 11:37:47', NULL, 10),
(4, 35, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/images/4th%20image%20-%20marketing%20and%20sales.jpg', NULL, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/audios/4th%20image%20-%20marketing%20and%20sales.mp3', 1, 4, '2026-10-16 11:37:47', NULL, 10),
(4, 36, 2, NULL, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/videos/1st%20video%20-%20difference%20between%20marketing%20and%20sales.mp4', 2, NULL, 1, 5, '2026-10-16 11:37:47', NULL, 30),
(4, 37, 2, NULL, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/videos/2nd%20video%20-%20marketing%20and%20slaes%20by%20raj%20shamani.mp4', 2, NULL, 1, 6, '2026-10-16 11:37:47', NULL, 35),
(11, 38, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/images/1st_image_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/audios/1st_audio_technical_road_construction.mp3', 1, 1, '2026-10-17 10:20:55', NULL, 28),
(11, 39, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/images/2nd_image_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/audios/2nd_audio_technical_road_construction.mp3', 1, 2, '2026-10-17 10:20:55', NULL, 38),
(11, 40, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/images/3rd_image_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/audios/3rd_audio_technical_road_construction.mp3', 1, 3, '2026-10-17 10:20:55', NULL, 78),
(11, 41, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/images/4th_image_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/audios/4th_audio_technical_road_construction.mp3', 1, 4, '2026-10-17 10:20:55', NULL, 50),
(11, 42, 2, NULL, 'http://localhost:3000/uploads/heavy_test_video.mp4', 2, NULL, 1, 5, '2026-10-17 10:20:55', NULL, 30),
(11, 43, 2, NULL, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/videos/2nd_video_technical_road_construction.mp4', 2, NULL, 1, 6, '2026-10-17 10:20:55', NULL, 35),
(12, 44, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/images/1st_image_technical_bridge_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/audios/1st_audio_technical_bridge_construction.mp3', 1, 1, '2026-10-17 15:51:46', NULL, 15),
(12, 45, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/images/2nd_image_technical_bridge_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/audios/2nd_audio_technical_bridge_construction.mp3', 1, 2, '2026-10-17 15:51:46', NULL, 15),
(12, 46, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/images/3rd_image_technical_bridge_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/audios/3rd_audio_technical_bridge_construction.mp3', 1, 3, '2026-10-17 15:51:46', NULL, 15),
(12, 47, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/images/4th_image_technical_bridge_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/audios/4th_audio_technical_bridge_construction.mp3', 1, 4, '2026-10-17 15:51:46', NULL, 15),
(12, 48, 2, NULL, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/videos/1st_video_technical_bridge_construction.mp4', 2, NULL, 1, 5, '2026-10-17 15:51:46', NULL, 35),
(12, 49, 2, NULL, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/videos/2nd_video_technical_bridge_construction.mp4', 2, NULL, 1, 6, '2026-10-17 15:51:46', NULL, 15),
(21, 50, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/images/1st_image_non_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/audios/1st_audio_non_technical_road_construction.mp3', 1, 1, '2026-10-17 17:15:24', NULL, 28),
(21, 51, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/images/2nd_image_non_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/audios/2nd_audio_non_technical_road_construction.mp3', 1, 2, '2026-10-17 17:15:24', NULL, 38),
(21, 52, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/images/3rd_image_non_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/audios/3rd_audio_non_technical_road_construction.mp3', 1, 3, '2026-10-17 17:15:24', NULL, 78),
(21, 53, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/images/4th_image_non_technical_road_construction.jpg', NULL, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/audios/4th_audio_non_technical_road_construction.mp3', 1, 4, '2026-10-17 17:15:24', NULL, 50),
(21, 54, 2, NULL, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/videos/1st_video_non_technical_road_construction.mp4', 2, NULL, 1, 5, '2026-10-17 17:15:24', NULL, 30),
(21, 55, 2, NULL, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/videos/2nd_video_non_technical_road_construction.mp4', 2, NULL, 1, 6, '2026-10-17 17:15:24', NULL, 35);

-- --------------------------------------------------------

--
-- Table structure for table `web_presentation_document_details_all`
--

CREATE TABLE `web_presentation_document_details_all` (
  `wph_id` int(11) NOT NULL,
  `wph_doc_id` int(11) NOT NULL,
  `doc_status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 = Published, 2 = Withdrawn',
  `doc_location` text DEFAULT NULL,
  `doc_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_presentation_document_details_all`
--

INSERT INTO `web_presentation_document_details_all` (`wph_id`, `wph_doc_id`, `doc_status`, `doc_location`, `doc_type`) VALUES
(1, 12, 1, 'https://3dbharat.miscos.in/openings/1st_figma%26ui_ux_designer/documents/figma-pdf.pdf', 1),
(2, 13, 1, 'https://3dbharat.miscos.in/openings/2nd_python_developer/documents/python%20developer%20roadmap%20pdf.pdf', 1),
(4, 14, 1, 'https://3dbharat.miscos.in/openings/4th_marketing_and_sales/documents/Marketing%20and%20sales%20pdf.pdf', 1),
(11, 15, 1, 'https://3dbharat.miscos.in/our_approach/technical/1st_road/documents/technical_road_construction_pdf.pdf', 1),
(12, 16, 1, 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/documents/technical_bridge_construction.pdf', 1),
(21, 17, 1, 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/documents/non_technical_road_construction_pdf.pdf', 1);

-- --------------------------------------------------------

--
-- Table structure for table `web_presentation_header_all`
--

CREATE TABLE `web_presentation_header_all` (
  `wph_id` int(11) NOT NULL COMMENT 'Identifier for the presentation (e.g. 1 for "3D Bharat Approach")',
  `web_ppt_name` varchar(100) NOT NULL COMMENT 'Title shown in header (e.g. "3DB Approach")',
  `web_ppt_type` int(11) NOT NULL COMMENT 'Type/category of the presentation\r\n1: technical,\r\n2: marketing/non-technical,\r\n3: openings module',
  `ppt_connected_page_status` int(11) NOT NULL COMMENT '1: active,\r\n2: inactive',
  `ppt_inserted_on` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation date',
  `ppt_valid_till` datetime DEFAULT NULL COMMENT 'Expiry or validity date',
  `full_screen` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: yes,\r\n2: no',
  `connect_with_us_popus` tinyint(1) NOT NULL DEFAULT 2 COMMENT '1: yes,\r\n2: no',
  `category_name` varchar(50) NOT NULL COMMENT 'It will show the card name, which will be inside of the technical or non-technical page of our approach module',
  `category_image` text NOT NULL COMMENT 'It will be the cover or card image, and it will be store inside of the same parent folder where the audio, images etc files will be stored',
  `category_short_description` text NOT NULL COMMENT 'It will be the short info about that techincal or non-technical card'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_presentation_header_all`
--

INSERT INTO `web_presentation_header_all` (`wph_id`, `web_ppt_name`, `web_ppt_type`, `ppt_connected_page_status`, `ppt_inserted_on`, `ppt_valid_till`, `full_screen`, `connect_with_us_popus`, `category_name`, `category_image`, `category_short_description`) VALUES
(1, 'Figma & UI UX Designer Task Brief', 3, 1, '2026-10-15 12:59:54', '2028-12-31 23:59:59', 1, 2, '', '', ''),
(2, 'Python Developer Task Brief', 3, 1, '2026-10-15 14:34:22', '2028-12-31 23:59:59', 2, 1, '', '', ''),
(4, 'Marketing & Sales Task Brief', 3, 1, '2026-10-16 11:37:47', '2028-12-31 23:59:59', 1, 2, '', '', ''),
(11, 'Technical Road Construction Methodology', 1, 1, '2026-10-17 10:20:54', '2028-12-31 23:59:59', 1, 2, 'Road Construction', 'https://3dbharat.miscos.in/our_approach/technical/1st_road/technical_road_construction-card_image.jpg', 'Precision 3D LiDAR & Drone survey methodology for highways, chainage-level quality audits, and volume estimation.'),
(12, 'Technical Bridge Infrastructure Methodology', 1, 1, '2026-10-17 15:51:46', '2028-12-31 23:59:59', 1, 2, 'Bridge Construction', 'https://3dbharat.miscos.in/our_approach/technical/2nd_bridge/technical_bridge%20construction_card_image.jpg', 'Structural health monitoring, pier & girder alignment, and 3D digital twin point cloud modeling for bridges.'),
(21, 'Road Construction Operational Methodology', 2, 1, '2026-10-17 17:15:23', '2028-12-31 23:59:59', 1, 2, 'Road Construction', 'https://3dbharat.miscos.in/our_approach/non_technical/1st_road/non_technical_road_construction_card_image.jpg', 'Executive workflows, operational planning, procurement scheduling, and contractor coordination for highway projects.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `web_presentation_details_all`
--
ALTER TABLE `web_presentation_details_all`
  ADD PRIMARY KEY (`slide_id`);

--
-- Indexes for table `web_presentation_document_details_all`
--
ALTER TABLE `web_presentation_document_details_all`
  ADD PRIMARY KEY (`wph_doc_id`);

--
-- Indexes for table `web_presentation_header_all`
--
ALTER TABLE `web_presentation_header_all`
  ADD PRIMARY KEY (`wph_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `web_presentation_details_all`
--
ALTER TABLE `web_presentation_details_all`
  MODIFY `slide_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID for the slide', AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `web_presentation_document_details_all`
--
ALTER TABLE `web_presentation_document_details_all`
  MODIFY `wph_doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `web_presentation_header_all`
--
ALTER TABLE `web_presentation_header_all`
  MODIFY `wph_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identifier for the presentation (e.g. 1 for "3D Bharat Approach")', AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
