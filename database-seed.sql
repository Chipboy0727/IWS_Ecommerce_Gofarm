-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: gofarm
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageSrc` text COLLATE utf8mb4_unicode_ci,
  `count` int NOT NULL DEFAULT '0',
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('4eb43c2e-65e5-4675-929e-da1327928bb5','Vegetables','vegetables','/images/ca2e6ecb716db66bfdcc5dc2d0f1eed24ce421b7-34x38.svg',11,'2026-04-24T03:39:24.809Z','2026-04-24T03:39:24.810Z'),('ac18b9f2-2d6d-4772-8f19-2f692d720f90','Fruits','fruits','/images/d3f76bf8d1d8c22c91bfe16349576edbfdf320aa-32x38.svg',14,'2026-04-24T03:39:24.810Z','2026-04-24T03:39:24.810Z'),('b94b8866-d978-40cc-8641-1e138cfced28','Juices','juices','/images/4ea4d386c71f3397a839fdc71beac5702bce3194-38x38.svg',5,'2026-04-24T03:39:24.810Z','2026-04-24T03:39:24.810Z'),('d102f71d-8627-4b5d-b9dc-974aabbce36f','Spices & Herbs','spices-herbs','/images/30481828d573e5121ff991cbc3a474f3b4caf008-38x38.svg',14,'2026-04-24T03:39:24.810Z','2026-04-24T03:39:24.810Z');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unread',
  `replyMessage` text COLLATE utf8mb4_unicode_ci,
  `repliedAt` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userRead` tinyint(1) DEFAULT '0',
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ('101e0e1c-6b01-41e3-927d-d4e68e38a1c7','Quế Mịch Nguyễn','quemichnq@gmail.com','abc','abc','replied','dạ','2026-05-01T09:22:39.816Z',0,'2026-05-01T08:36:41.400Z','2026-05-01T09:22:39.816Z'),('29b6069f-7a01-486f-9c94-b63c0962aaee','Quế Nguyễn Quánucw','Quemichnq@gmail.com','cwc','cưcdw','replied','ok anh','2026-05-01T09:02:38.090Z',0,'2026-05-01T08:53:37.514Z','2026-05-01T09:02:38.090Z'),('5e9cd739-1901-44bb-bb08-bae4fa6ab1b8','Quế Mịch Nguyễn','quemichnq@gmail.com','test','ok','replied','dạ','2026-05-01T09:14:42.243Z',0,'2026-05-01T08:48:12.502Z','2026-05-01T09:14:42.243Z'),('7758fe3c-0f4a-4511-956e-6e7aefa03208','Quế Mịch Nguyễn','quemichnq@gmail.com','test','xin chao tôi hỏi về','unread',NULL,NULL,0,'2026-05-01T03:32:33.633Z','2026-05-01T03:32:33.633Z'),('8f9c85ab-76da-48db-b472-6a16ee6e6616','quế','test1@gofarm.local','ok','ok','replied','ok a','2026-05-01T09:26:29.447Z',1,'2026-05-01T09:26:08.383Z','2026-05-01T09:26:29.447Z'),('bf87aee1-d4c5-49d8-a1d6-85cca43fe6cf','qm','test1@gofarm.local','ok1','oakjcbkabcka','replied','kê','2026-05-02T03:10:27.855Z',1,'2026-05-02T03:06:00.563Z','2026-05-02T03:10:27.855Z'),('f4c12685-7e2f-4381-ab55-66a6a91b3c86','Quế Mịch','quemich@gmail.com','dsvds','svsdvs','replied','dạ','2026-05-01T09:24:57.413Z',0,'2026-05-01T09:03:12.905Z','2026-05-01T09:24:57.413Z');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta`
--

DROP TABLE IF EXISTS `meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta` (
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta`
--

LOCK TABLES `meta` WRITE;
/*!40000 ALTER TABLE `meta` DISABLE KEYS */;
INSERT INTO `meta` VALUES ('state','{\"version\":1,\"updatedAt\":\"2026-05-02T09:12:05.870Z\"}');
/*!40000 ALTER TABLE `meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `items` int NOT NULL DEFAULT '0',
  `products` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `shippingAddress` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerEmail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerPhone` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethod` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('ORD-1777004146392','2026-04-24',140.80,'delivered',8,'[{\"id\":\"976cd1bb-277c-4ebe-b1b6-5d6dd3275706\",\"name\":\"Tomato Juices\",\"price\":13,\"quantity\":1,\"imageSrc\":\"/images/3c7db86fd76d8fca08104d95fda225f19f791dc6-1024x1024.jpg\",\"slug\":\"tomato-juices\"},{\"id\":\"976cd1bb-277c-4ebe-b1b6-5d6dd3275706-500g\",\"name\":\"Tomato Juices (500g)\",\"price\":6.5,\"quantity\":2,\"imageSrc\":\"/images/3c7db86fd76d8fca08104d95fda225f19f791dc6-1024x1024.jpg\",\"slug\":\"tomato-juices\"},{\"id\":\"9d2051b8-a2e2-4af8-907b-119cdcc657e9-5 kg\",\"name\":\"Onion (5 kg)\",\"price\":30,\"quantity\":1,\"imageSrc\":\"/images/85ac88e07f70e96e5fa9000e705353fd4e6f7bc6-750x750.webp\",\"slug\":\"onion\"},{\"id\":\"9d2051b8-a2e2-4af8-907b-119cdcc657e9\",\"name\":\"Onion\",\"price\":6,\"quantity\":1,\"imageSrc\":\"/images/85ac88e07f70e96e5fa9000e705353fd4e6f7bc6-750x750.webp\",\"slug\":\"onion\"},{\"id\":\"f97d8cdd-9480-4256-9f08-8e4d5e0b8209\",\"name\":\"Fresh Cola\",\"price\":11,\"quantity\":2,\"imageSrc\":\"/images/6118ddb77b5d2363bec2f80a620f4039393126e5-1024x1024.jpg\",\"slug\":\"fresh-cola\"},{\"id\":\"1ba25f79-c611-48b5-8c4a-0b69ef08be8c\",\"name\":\"Raspberry \\bjuice\",\"price\":11,\"quantity\":1,\"imageSrc\":\"/images/54cf822a03d12e5a334d0a3c8d1d14b3d2652a06-1024x1024.jpg\",\"slug\":\"raspberry-juice\"},{\"id\":\"1ba25f79-c611-48b5-8c4a-0b69ef08be8c-2 Bottles\",\"name\":\"Raspberry \\bjuice (2 Bottles)\",\"price\":22,\"quantity\":1,\"imageSrc\":\"/images/54cf822a03d12e5a334d0a3c8d1d14b3d2652a06-1024x1024.jpg\",\"slug\":\"raspberry-juice\"},{\"id\":\"abb8a86d-91e1-41c5-a8a5-adea1cafeca0-1 Bottle\",\"name\":\"Lemon Juice (1 Bottle)\",\"price\":11,\"quantity\":1,\"imageSrc\":\"/images/4d3f1a9a6b2eb65abf45c44e29dfa4866269a029-1024x1024.jpg\",\"slug\":\"lemon-juice\"}]','undefined, undefined, undefined undefined','Admin','admin@gofarm.local','','Cash on Delivery','2026-04-24T04:15:46.411Z','2026-04-30T08:46:48.327Z'),('ORD-1777543266249','2026-04-30',11.27,'delivered',2,'[{\"id\":\"VG-BR-01\",\"name\":\"Broccoli (Súp lơ xanh)\",\"price\":2.5,\"quantity\":1,\"imageSrc\":\"/images/v.suploxanh.jpg\",\"slug\":\"broccoli\"},{\"id\":\"VG-CA-01\",\"name\":\"Cauliflower (Súp lơ trắng)\",\"price\":2.3,\"quantity\":1,\"imageSrc\":\"/images/v.suplotrang.jpg\",\"slug\":\"cauliflower\"}]','30, CT12C, Kim Văn Kim Lũ, Quận Hoàng Mai, Thành phố Hà Nội 123123','Admin1','admin@gofarm.local','','Cash on Delivery','2026-04-30T10:01:06.272Z','2026-04-30T14:18:10.979Z'),('ORD-1777570615539','2026-04-30',19.96,'pending',3,'[{\"id\":\"FR-AP-01\",\"name\":\"Fuji Apple (Táo Fuji)\",\"price\":5.5,\"quantity\":1,\"imageSrc\":\"/images/f.taofuji.jpg\",\"slug\":\"fuji-apple\"},{\"id\":\"FR-BA-01\",\"name\":\"Laba Banana (chuối Laba)\",\"price\":1.2,\"quantity\":1,\"imageSrc\":\"/images/f.chuoilaba.jpg\",\"slug\":\"laba-banana\"},{\"id\":\"VG-AS-01\",\"name\":\"Asparagus (Măng tây)\",\"price\":6,\"quantity\":1,\"imageSrc\":\"/images/v.mangtay.jpg\",\"slug\":\"asparagus\"}]','30, CT12C, Kim Văn Kim Lũ, Quận Hoàng Mai, Thành phố Hà Nội 123123','test1','test1@gofarm.local','','Cash on Delivery','2026-04-30T17:36:55.562Z','2026-04-30T17:36:55.562Z');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageSrc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageAlt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(4,2) NOT NULL DEFAULT '0.00',
  `reviews` int NOT NULL DEFAULT '0',
  `stock` int DEFAULT NULL,
  `status` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('FR-AP-01','Fuji Apple','fuji-apple','/images/f.taofuji.jpg','Fuji Apple',5.50,0.00,NULL,'Japan','CAT-FR','FRUITS','Crispy, sweet, and intensely flavorful, imported directly from Japan.',5.00,120,100,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-AP-02','Granny Smith Apple','granny-smith-apple','/images/f.taoxanh.jpg','Granny Smith Apple',4.50,5.00,NULL,'USA','CAT-FR','FRUITS','Features a signature tartness with a vibrant green skin.',4.80,85,150,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-AV-01','Butter Avocado','butter-avocado','/images/f.bosap.jpg','Butter Avocado',3.50,0.00,NULL,'Dak Lak, VN','CAT-FR','FRUITS','Rich, creamy, and smooth like fresh butter.',4.50,160,110,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-BA-01','Laba Banana','laba-banana','/images/f.chuoilaba.jpg','Laba Banana',1.20,0.00,NULL,'Da Lat, VN','CAT-FR','FRUITS','A Da Lat specialty known for its rich aroma and naturally chewy texture.',4.70,210,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-BL-01','Blueberry','blueberry','/images/f.vietquat.jpg','Blueberry',15.00,20.00,NULL,'Chile','CAT-FR','FRUITS','A superfood from Chile; great for memory and brain health.',4.90,140,100,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-DR-01','Red Flesh Dragon Fruits','red-dragon-fruit','/images/f.thanhlong.jpg','Red Dragon Fruit',2.20,0.00,NULL,'Binh Thuan, VN','CAT-FR','FRUITS','Pink skin with a striking red interior; packed with antioxidants.',4.50,90,120,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-DU-01','Ri6 Durian','ri6-durian','/images/f.saurieng.jpg','Ri6 Durian',12.00,0.00,NULL,'Vinh Long, VN','CAT-FR','FRUITS','Famous for its thick golden flesh and creamy taste.',4.90,500,30,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-GR-01','Shine Muscat Grape','shine-muscat-grape','/images/f.nhomaudon.jpg','Shine Muscat Grape',25.00,15.00,NULL,'Korea','CAT-FR','FRUITS','Unique jasmine aroma, large seedless berries.',5.00,60,25,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-GR-02','American Black Grape','black-grape','/images/f.nhodenmy.jpg','Black Grape',8.50,0.00,NULL,'USA','CAT-FR','FRUITS','Deeply sweet with thin skin; excellent for heart health.',4.60,110,45,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-GU-01','Queen Guava','queen-guava','/images/f.oiqueen.jpg','Queen Guava',1.50,0.00,NULL,'Taiwan','CAT-FR','FRUITS','Crunchy and low in seeds with a mild sweetness.',4.30,105,85,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-KI-01','Golden Kiwi','golden-kiwi','/images/f.kiwivang.jpg','Golden Kiwi',9.50,0.00,NULL,'New Zealand','CAT-FR','FRUITS','Vibrant yellow flesh with a honey-like sweetness.',4.70,95,90,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-MA-01','Hoa Loc Mango','hoa-loc-mango','/images/f.xoaicat.jpg','Hoa Loc Mango',3.80,10.00,NULL,'Tien Giang, VN','CAT-FR','FRUITS','The King of Mangoes with golden flesh and incredible fragrance.',4.90,340,80,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-MA-02','Mangosteen','mangosteen','/images/f.mangcut.jpg','Mangosteen',4.50,0.00,NULL,'Ben Tre, VN','CAT-FR','FRUITS','The Queen of Fruits with a perfect sweet-sour balance.',4.80,130,60,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-OR-01','King Orange','king-orange','/images/f.camsanh.jpg','King Orange',1.80,0.00,NULL,'Ha Giang, VN','CAT-FR','FRUITS','Thick-skinned and incredibly juicy; ideal for juices.',4.40,180,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-PE-01','Korean Pear','korean-pear','/images/f.lehanquoc.jpg','Korean Pear',6.00,0.00,NULL,'Korea','CAT-FR','FRUITS','Large, crunchy, and exceptionally juicy.',4.60,80,55,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-PI-01','Pineapple','pineapple','/images/f.dua.jpg','Pineapple',1.20,0.00,NULL,'Ninh Binh, VN','CAT-FR','FRUITS','Intense tropical aroma with a sweet and tangy kick.',4.50,190,130,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-PO-01','Green Skin Pomelo','green-skin-pomelo','/images/f.buoidaxanh.jpg','Green Skin Pomelo',5.00,0.00,NULL,'Ben Tre, VN','CAT-FR','FRUITS','Pink, dry pulp with a refined sweet flavor.',4.70,75,40,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-RA-01','Rambutan','rambutan','/images/f.chomchom.jpg','Rambutan',2.00,0.00,NULL,'Dong Nai, VN','CAT-FR','FRUITS','Freshly picked clusters with firm, sweet flesh.',4.40,220,150,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-ST-01','Strawberry','strawberry','/images/f.dautay.jpg','Strawberry',7.00,0.00,NULL,'Da Lat, VN','CAT-FR','FRUITS','Bright red, succulent berries from the misty highlands.',4.80,250,70,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('FR-WA-01','Seedless Watermelon','seedless-watermelon','/images/f.duahaukohat.jpg','Seedless Watermelon',2.50,0.00,NULL,'Long An, VN','CAT-FR','FRUITS','Juicy, deep red, and seed-free; perfect refreshment.',4.60,150,50,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('JU-AL-01','Aloe Vera Drink','aloe-vera-drink','/images/j.nuocnhadam.jpg','Aloe Vera Drink',2.80,0.00,NULL,'Vietnam','CAT-JU','JUICES','Soothing and hydrating with real aloe bits.',4.50,55,55,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-AP-01','Apple Juice','apple-juice','/images/j.nuoctao.jpg','Apple Juice',3.20,0.00,NULL,'Vietnam','CAT-JU','JUICES','Sweet and refreshing apple juice, no added sugar.',4.70,40,40,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-BE-01','Mixed Berry Juice','mixed-berry-juice','/images/j.nuoceptonghop.png','Mixed Berry Juice',4.50,5.00,NULL,'China','CAT-JU','JUICES','Antioxidant-rich berry blend, refreshing and tart.',4.90,20,20,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-BT-01','Beetroot Juice','beetroot-juice','/images/j.nuoccuden.png','Beetroot Juice',3.50,0.00,NULL,'Korea','CAT-JU','JUICES','Nutrient-dense, great for blood circulation.',4.70,25,25,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-CA-01','Carrot Juice','carrot-juice','/images/j.nuoccarot.jpg','Carrot Juice',3.00,0.00,NULL,'Vietnam','CAT-JU','JUICES','Rich in beta-carotene for healthy skin and eyes.',4.60,35,35,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-CE-01','Celery Juice','celery-juice','/images/j.nuoccan.png','Celery Juice',3.20,0.00,NULL,'Vietnam','CAT-JU','JUICES','Pure celery juice, excellent for digestion.',4.60,45,45,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-CO-01','Coconut Water','coconut-water','/images/j.nuocduatuoi.jpg','Coconut Water',2.20,0.00,NULL,'Vietnam','CAT-JU','JUICES','100% pure, natural electrolytes for hydration.',4.60,80,80,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-DE-01','Green Detox Juice','green-detox-juice','/images/j.nuocdetox.jpg','Green Detox Juice',4.00,0.00,NULL,'Vietnam','CAT-JU','JUICES','Kale, celery, and apple blend for a healthy cleanse.',4.70,30,30,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-GP-01','Grape Juice','grape-juice','/images/j.nuocnho.jpg','Grape Juice',4.20,0.00,NULL,'Turkey','CAT-JU','JUICES','Refreshing grape juice, rich in antioxidants.',4.60,30,30,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-GR-01','Grapefruit Juice','grapefruit-juice','/images/j.nuocbuoi.png','Grapefruit Juice',3.20,0.00,NULL,'Australia','CAT-JU','JUICES','Refreshing and tart, helps with weight management.',4.40,30,30,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-GU-01','Guava Juice','guava-juice','/images/j.nuocoi.jpg','Guava Juice',2.80,0.00,NULL,'Vietnam','CAT-JU','JUICES','Sweet and fragrant, high in Vitamin C.',4.70,50,50,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-LM-01','Fresh Lemonade','lemonade','/images/j.nuocchanh.jpg','Fresh Lemonade',2.50,0.00,NULL,'Vietnam','CAT-JU','JUICES','Classic refreshing lemonade with a perfect balance.',4.50,70,70,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-MA-01','Mango Juice','mango-juice','/images/j.nuocxoai.jpg','Mango Juice',3.50,0.00,NULL,'Vietnam','CAT-JU','JUICES','Creamy and tropical mango juice, rich and sweet.',4.80,40,40,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-OR-01','Orange Juice','orange-juice','/images/j.nuoccam.jpg','Orange Juice',3.50,0.00,NULL,'Vietnam','CAT-JU','JUICES','Freshly squeezed orange juice, rich in Vitamin C.',4.80,50,50,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-PA-01','Passion Fruit Juice','passion-fruit-juice','/images/j.nuocchanhleo.png','Passion Fruit Juice',2.80,0.00,NULL,'Vietnam','CAT-JU','JUICES','Tangy and aromatic, full of antioxidants.',4.70,65,65,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-PC-01','Peach Juice','peach-juice','/images/j.nuocdao.jpg','Peach Juice',3.40,0.00,NULL,'Vietnam','CAT-JU','JUICES','Sweet and aromatic, refreshing taste for summer.',4.50,35,35,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-PI-01','Pineapple Juice','pineapple-juice','/images/j.nuocduas.jpg','Pineapple Juice',3.00,0.00,NULL,'Nam Phi','CAT-JU','JUICES','Tropical and tangy, aids in digestion.',4.50,45,45,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-PM-01','Pomegranate Juice','pomegranate-juice','/images/j.nuocluu.jpg','Pomegranate Juice',4.80,10.00,NULL,'Turkey','CAT-JU','JUICES','Super-antioxidant, great for skin health.',5.00,25,25,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-TM-01','Tomato Juice','tomato-juice','/images/j.nuoccachua.jpg','Tomato Juice',2.60,0.00,NULL,'Vietnam','CAT-JU','JUICES','Rich in lycopene for heart and skin health.',4.40,40,40,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('JU-WA-01','Watermelon Juice','watermelon-juice','/images/j.nuocduahau.jpg','Watermelon Juice',2.80,0.00,NULL,'Korea','CAT-JU','JUICES','Pure, hydrating watermelon juice for summer.',4.60,60,60,'available','2026-04-30T08:47:51.599Z','2026-04-30T08:47:51.599Z'),('SH-BA-01','Thai Basil','thai-basil','/images/s.hungque.png','Thai Basil',0.80,0.00,NULL,'HCM, VN','CAT-SH','SPICES','Bold fragrance for Pho and hotpot dishes.',4.70,130,90,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-BA-02','Vietnamese Balm','vietnamese-balm','/images/s.kinhgioi.jpg','Balm',0.80,0.00,NULL,'Ha Noi, VN','CAT-SH','SPICES','Cooling and aromatic; helps with heat relief.',4.50,80,65,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-CH-01','Bird Eye Chili','birds-eye-chili','/images/s.otchithien.jpg','Chili',5.00,0.00,NULL,'Dong Thap, VN','CAT-SH','SPICES','Signature intense heat to add a spicy kick.',4.80,300,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-CH-02','Horn Chili','horn-chili','/images/s.otsung.jpg','Horn Chili',2.00,0.00,NULL,'Mien Tay, VN','CAT-SH','SPICES','Mildly spicy; perfect for sauces and garnishing.',4.40,120,150,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-CO-01','Coriander','coriander','/images/s.raumui.jpg','Coriander',0.50,0.00,NULL,'Nam Dinh, VN','CAT-SH','SPICES','Fragrant leaves that add a sophisticated touch.',4.60,350,300,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-CO-02','Vietnamese Coriander','vietnamese-coriander','/images/s.rauram.jpg','Rau Ram',0.80,0.00,NULL,'Dong Thap, VN','CAT-SH','SPICES','Peppery and sharp; balances seafood dishes.',4.50,140,110,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-DI-01','Dill','dill','/images/s.thiala.jpg','Dill',0.80,0.00,NULL,'Hai Duong, VN','CAT-SH','SPICES','Unique aromatic herb for fish recipes.',4.60,75,55,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-GA-01','Garlic','garlic','/images/s.toita.jpg','Garlic',3.00,0.00,NULL,'Phan Rang, VN','CAT-SH','SPICES','Pungent local garlic; naturally boosts immunity.',4.70,800,1000,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-GA-02','Solo Garlic','solo-garlic','/images/s.toicodon.jpg','Solo Garlic',15.00,10.00,NULL,'Ly Son, VN','CAT-SH','SPICES','Ly Son specialty; delicate aroma without odor.',5.00,120,50,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-GA-03','Galangal','galangal','/images/s.rieng.jpg','Galangal',1.50,0.00,NULL,'Thai Binh, VN','CAT-SH','SPICES','Lightly spicy; key to traditional flavors.',4.30,150,120,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-GI-01','Ginger','ginger','/images/s.gung.jpg','Ginger',2.50,0.00,NULL,'Nghe An, VN','CAT-SH','SPICES','Warm and spicy; aids digestion and warms.',4.60,420,400,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-LE-01','Lemongrass','lemongrass','/images/s.sa.jpg','Lemongrass',1.00,0.00,NULL,'Long An, VN','CAT-SH','SPICES','Aromatic stalks for braised and stir-fried.',4.50,400,450,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-LI-01','Lime Leaf','lime-leaf','/images/s.lachanh.jpg','Lime Leaf',1.00,0.00,NULL,'Hung Yen, VN','CAT-SH','SPICES','Exceptionally fragrant soul of boiled chicken.',4.80,280,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-LI-02','Seedless Lime','seedless-lime','/images/s.chanhkohat.png','Lime',1.50,0.00,NULL,'Long An, VN','CAT-SH','SPICES','Juicy seed-free convenience for drinks.',4.70,450,350,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-MI-01','Spearmint','spearmint','/images/s.hunglui.jpg','Spearmint',0.80,0.00,NULL,'Lam Dong, VN','CAT-SH','SPICES','Refreshing and cool zing for salads.',4.60,160,130,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-ON-01','Green Onion','green-onion','/images/s.hanhla.jpg','Green Onion',0.50,0.00,NULL,'Hai Duong, VN','CAT-SH','SPICES','Fresh green stalks that enhance Vietnamese dishes.',4.50,600,500,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-ON-02','Onion','onion','/images/s.hanhtay.jpg','Onion',1.20,0.00,NULL,'Da Lat, VN','CAT-SH','SPICES','Sweet and crunchy; foundational ingredient.',4.40,580,600,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-PE-01','Perilla','perilla','/images/s.tiato.jpg','Perilla',0.80,0.00,NULL,'Bac Ninh, VN','CAT-SH','SPICES','Fresh purple leaves for soothing and wrapping.',4.60,95,70,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-SH-01','Shallot','shallot','/images/s.hanhtim.jpg','Shallot',2.80,0.00,NULL,'Soc Trang, VN','CAT-SH','SPICES','Firm bulbs that provide classic fragrance.',4.50,750,800,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('SH-TU-01','Turmeric','turmeric','/images/s.nghe.jpg','Turmeric',2.00,0.00,NULL,'Nghe An, VN','CAT-SH','SPICES','Fresh turmeric rich in curcumin; for skin.',4.60,200,180,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-AS-01','Asparagus','asparagus','/images/v.mangtay.jpg','Asparagus',6.00,0.00,NULL,'Ninh Thuan, VN','CAT-VG','VEGETABLES','Premium Grade-A stalks; crunchy and rich.',4.80,90,45,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-BE-01','Red Bell Pepper','red-bell-pepper','/images/v.otchuongdo.jpg','Red Bell Pepper',3.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Crunchy and non-spicy boost of Vitamin C.',4.70,120,60,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-BE-02','Yellow Bell Pepper','yellow-bell-pepper','/images/v.otchuongvang.jpg','Yellow Bell Pepper',3.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Brightly colored and mild visual appeal.',4.70,105,60,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-BO-01','Bok Choy','bok-choy','/images/v.caithia.jpg','Bok Choy',1.20,0.00,NULL,'Mien Tay, VN','CAT-VG','VEGETABLES','Fresh green stalks with a cool, mild taste.',4.30,200,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-BR-01','Broccoli','broccoli','/images/v.suploxanh.jpg','Broccoli',2.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Organic green florets, rich in iron and minerals.',4.80,150,100,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-CA-01','Cauliflower','cauliflower','/images/v.suplotrang.jpg','Cauliflower',2.30,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Fresh, firm white heads; perfect for stir-fries.',4.60,90,80,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-CA-02','Carrot','carrot','/images/v.carot.jpg','Carrot',1.20,0.00,NULL,'Bac Ninh, VN','CAT-VG','VEGETABLES','Bright orange crunchy roots rich in Vitamin A.',4.50,500,500,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-CB-01','White Cabbage','white-cabbage','/images/v.bapcaixanh.jpg','White Cabbage',1.00,0.00,NULL,'Hai Duong, VN','CAT-VG','VEGETABLES','Crispy and sweet leaves; strictly safe standards.',4.40,300,300,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-CB-02','Purple Cabbage','purple-cabbage','/images/v.bapcaitim.jpg','Purple Cabbage',1.80,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Visually striking and great for healthy salads.',4.50,60,50,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-CU-01','Cucumber','cucumber','/images/v.dualeo.jpg','Cucumber',1.00,0.00,NULL,'Tay Ninh, VN','CAT-VG','VEGETABLES','Cool and crunchy; provides instant hydration.',4.30,380,200,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-KA-01','Kale','kale','/images/v.caixoan.jpg','Kale',3.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','The Queen of Greens for a healthy lifestyle.',4.90,85,40,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-LE-01','Hydroponic Lettuce','hydroponic-lettuce','/images/v.xalach.jpg','Lettuce',2.00,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Cleanly grown in water; soft and crispy.',4.70,110,60,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-NA-01','Napa Cabbage','napa-cabbage','/images/v.caithao.jpg','Napa Cabbage',1.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Soft leaves with a delicate sweetness for hotpots.',4.60,120,120,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-PO-01','Potato','potato','/images/v.khoaitay.jpg','Potato',1.50,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Starchy and fragrant potatoes; preservative-free.',4.60,400,400,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-PU-01','Pumpkin','pumpkin','/images/v.bido.jpg','Pumpkin',1.80,0.00,NULL,'Dak Lak, VN','CAT-VG','VEGETABLES','Dense, buttery flesh; excellent energy source.',4.60,150,100,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-SP-01','Spinach','spinach','/images/v.caiboxoi.jpg','Spinach',2.80,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Nutritional powerhouse that supports digestion.',4.80,180,90,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-SP-02','Purple Sweet Potato','purple-sweet-potato','/images/v.khoaitim.jpg','Purple Sweet Potato',2.00,0.00,NULL,'Vinh Long, VN','CAT-VG','VEGETABLES','Naturally sweet; high in anti-aging antioxidants.',4.70,350,350,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-TO-01','Cherry Tomato','cherry-tomato','/images/v.cachuabi.jpg','Cherry Tomato',3.00,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Tiny, sweet tomato candies eaten as a snack.',4.90,180,150,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-TO-02','Tomato','tomato','/images/v.cachua.jpg','Tomato',1.50,0.00,NULL,'Lam Dong, VN','CAT-VG','VEGETABLES','Naturally ripened and juicy; rich in lycopene.',4.50,450,250,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z'),('VG-ZU-01','Zucchini','zucchini','/images/v.bingoi.jpg','Zucchini',2.20,0.00,NULL,'Da Lat, VN','CAT-VG','VEGETABLES','Thin-skinned and tender; great for heart health.',4.40,95,70,'available','2026-04-26T18:53:30.249Z','2026-04-26T18:53:30.249Z');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hours` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pinX` int NOT NULL DEFAULT '0',
  `pinY` int NOT NULL DEFAULT '0',
  `manager` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageSrc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES ('a1e0cf6b-c65c-4b7c-bdcf-b9469b04374d','GoFarm Dong Da','1 Chua Boc Street, Trung Liet Ward, Dong Da District, Hanoi','+84 902 999 999','dongda@gofarm.com','Vietnam','Monday - Sunday: 8AM - 9PM','Hanoi',0,0,'Tuan','+84 902 999 999','/images/logo.svg','Active','2026-04-29T17:38:45.857Z','2026-04-29T17:38:45.857Z'),('bend-boutique','GoFarm Tay Ho','612 Lac Long Quan Street, Nhat Tan Ward, Tay Ho District, Hanoi','+84 987 654 321','tayho@gofarm.com','Vietnam','Monday - Friday: 9AM - 6PM','Hanoi',28,46,'Elena Rossi','+84 987 654 321','/images/image_3.jpg','Active','2026-04-24T02:51:37.970Z','2026-04-24T02:51:37.970Z'),('downtown-store','GoFarm Hoan Kiem','1 Dinh Tien Hoang Street, Hang Trong Ward, Hoan Kiem District, Hanoi','+84 24 3825 5666','hoankiem@gofarm.com','Vietnam','Monday - Friday: 9AM - 6PM','Hanoi',32,54,'Sarah Jenkins','+84 24 3825 5666','/images/image_5.jpg','Active','2026-04-24T02:51:37.970Z','2026-04-24T02:51:37.970Z'),('f02e2444-9ca2-4a3f-9487-8b00c853ab2a','GoFarm Hai Ba Trung','29 Dai Co Viet Street, Bach Khoa Ward, Hai Ba Trung District, Hanoi','+84 983 888 888','haibatrung@gofarm.com','Vietnam','Monday - Sunday: 8AM - 9PM','Hanoi',0,0,'Quemich','+84 983 888 888','/images/logo.svg','Active','2026-04-30T08:02:37.994Z','2026-04-30T08:02:37.994Z'),('north-ridge-logistics','GoFarm Cau Giay','234 Cau Giay Street, Quan Hoa Ward, Cau Giay District, Hanoi','+84 912 345 678','caugiay@gofarm.com','Vietnam','Monday - Saturday: 8AM - 7PM','Hanoi',22,58,'Robert Chen','+84 912 345 678','/images/image_7.jpg','Maintenance','2026-04-24T02:51:37.970Z','2026-04-24T02:51:37.970Z');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resetTokenHash` text COLLATE utf8mb4_unicode_ci,
  `resetTokenExpiresAt` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('36f0aa9f-b968-4151-a09d-28ad9d32877f','thủy','thuthuy205.hanu@gmail.com','cbf3e90cff207f1da52a2691b23e3c30:1705f2b94be5b4e67c3d347ea08b1868049023e4d0882c4f655d5cc1f6b4cc40','user','2026-04-21T16:17:06.839Z','2026-04-21T16:17:06.839Z',NULL,NULL,'Active'),('61fe7a32-4135-492c-8cc5-de1eac8ae971','Quemich2','quemichnq@gmail.com','deedc8c83c50c5da016af6a578b2f65d:ee1005d27977ecc6ecdd8021a032badc4bfc8a339a84b2fd627a013264c3ba39','admin','2026-04-26T07:48:09.843Z','2026-04-26T14:06:58.107Z',NULL,NULL,'Active'),('7e023e76-157f-4651-90ae-93e19ebe2cda','Admin1','admin@gofarm.local','43ae2010e13654cb7e5b80f5534b0569:48ffec71309806b159044e4d2bd6b917595219d0a08da218dc3ab3b7bc565e72','admin','2026-04-21T16:17:06.895Z','2026-04-26T13:56:27.448Z',NULL,NULL,'Active'),('8258c766-4724-4528-9bb0-fe6d813ca5c4','Quyen Le','quyenthe194@gmail.com','c06ff67a288bff691f9c0111569c7b67:5cca926ddc94174003ff1551a12b766de40c1af02f21a29265ca5c270a0c5082','user','2026-05-01T09:41:31.982Z','2026-05-01T09:41:31.982Z',NULL,NULL,'Active'),('9086c16e-01b4-430c-a361-a2a26de381df','test1','test1@gofarm.local','a7db17d061ae164cacb02fcc25e90e3a:f3099725c537af214a58f813e9e6c308de2882d2e9c8e91e2010ef20e2d6f302','user','2026-04-26T14:06:48.413Z','2026-04-26T14:06:48.413Z',NULL,NULL,'Active'),('9ed44caa-1904-4a94-b56c-4da47ecfe48e','Hoa','hoa@gmail.com','335fb029c7eaf491185fbc633309568a:507f8f03b955504becd86fe047b92a2ed90943f218b4e2861db9837bd33a217d','user','2026-05-01T09:50:37.915Z','2026-05-01T09:50:37.915Z',NULL,NULL,'Active'),('user-test-id','Test User','user@gofarm.local','77b4484aa083df2c649809658ce98aa2:b3536e33188ed3ce5e9b5db1155bb9574c8883448acfdbd90e81dcdd81a8b5e8','user','2026-04-25T10:00:00.000Z','2026-04-25T10:00:00.000Z',NULL,NULL,'Active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02 16:24:30
