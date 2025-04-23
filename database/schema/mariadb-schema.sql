/*M!999999\- enable the sandbox mode */ 
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_franchises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_franchises` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'フランチャイズID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'キー',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `phonetic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'よみがな',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'タイトルノード表示用名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='ゲームフランチャイズデータ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_main_network_franchises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_main_network_franchises` (
  `game_franchise_id` bigint(20) unsigned NOT NULL COMMENT 'フランチャイズID',
  `json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'JSON' CHECK (json_valid(`json`)),
  `x` int(11) DEFAULT NULL COMMENT 'x',
  `y` int(11) DEFAULT NULL COMMENT 'y',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_franchise_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='メインネットワーク上の1フランチャイズの配置データ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_main_network_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_main_network_params` (
  `id` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'ID',
  `val` int(11) NOT NULL DEFAULT 0 COMMENT '値',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_maker_package_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_maker_package_links` (
  `game_maker_id` int(10) unsigned NOT NULL COMMENT 'メーカーID',
  `game_package_id` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'パッケージID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_maker_id`,`game_package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='メーカーとパッケージの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_maker_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_maker_sites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `game_maker_id` int(10) unsigned NOT NULL COMMENT 'ゲームメーカーID',
  `node_name` varchar(200) NOT NULL COMMENT 'ノード表示用名称',
  `url` text NOT NULL COMMENT 'URL',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`),
  KEY `game_maker_id` (`game_maker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ゲームメーカーのサイトURL';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_maker_synonyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_maker_synonyms` (
  `game_maker_id` bigint(20) unsigned NOT NULL COMMENT 'メーカーID',
  `synonym` varchar(100) NOT NULL DEFAULT '' COMMENT '俗称',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '作成日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  KEY `synonym` (`synonym`),
  KEY `game_maker_id` (`game_maker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ゲームメーカーの俗称';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_makers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_makers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ゲーム会社ID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'キー',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ゲーム会社名',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'タイトルノード表示用名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `related_game_maker_id` int(11) DEFAULT NULL COMMENT '何かしら関係のあるメーカーID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームメーカー情報';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_media_mix_game_title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_media_mix_game_title` (
  `game_media_mix_id` int(10) unsigned NOT NULL COMMENT 'メディアミックスID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_media_mix_id`,`game_title_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='メディアミックスとゲームタイトルの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_media_mix_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_media_mix_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'メディアミックスグループID',
  `game_franchise_id` int(11) NOT NULL DEFAULT 0 COMMENT 'フランチャイズID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `sort_order` int(11) NOT NULL DEFAULT 1 COMMENT '表示順',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='メディアミックスグループ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_media_mix_related_product_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_media_mix_related_product_links` (
  `game_media_mix_id` int(10) unsigned NOT NULL COMMENT 'メディアミックスID',
  `game_related_product_id` int(10) unsigned NOT NULL COMMENT '関連商品ID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_related_product_id`,`game_media_mix_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='メディアミックスと関連商品の紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_media_mixes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_media_mixes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'メディアミックスID',
  `key` varchar(50) NOT NULL COMMENT 'キー',
  `type` smallint(6) NOT NULL COMMENT 'メディアミックス種別',
  `name` varchar(200) NOT NULL COMMENT '名称',
  `node_name` varchar(200) NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) NOT NULL COMMENT 'H1用ノード名称',
  `game_franchise_id` int(10) unsigned DEFAULT NULL COMMENT 'フランチャイズID',
  `game_media_mix_group_id` int(10) unsigned DEFAULT NULL COMMENT 'メディアミックスグループID',
  `rating` tinyint(3) NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `sort_order` smallint(5) unsigned NOT NULL COMMENT '表示順',
  `description` text NOT NULL DEFAULT '' COMMENT '説明',
  `description_source` text DEFAULT NULL COMMENT '説明の引用元',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `use_ogp_description` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'OGPの紹介文をあらすじに流用するフラグ',
  `og_url` text DEFAULT NULL COMMENT 'OGP情報取得のためのURL',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='メディアミックス';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_official_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_official_sites` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'サイト名',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'URL',
  `priority` tinyint(3) unsigned NOT NULL COMMENT '優先度',
  `is_adult` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'アダルトサイトフラグ',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_title_id`,`url`) USING BTREE,
  KEY `game_official_sites_soft_id_priority_index` (`game_title_id`,`priority`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームタイトルのサイトURL';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_package_group_package_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_package_group_package_links` (
  `game_package_group_id` int(10) unsigned NOT NULL COMMENT 'ゲームパッケージグループID',
  `game_package_id` int(10) unsigned NOT NULL COMMENT 'パッケージID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_package_group_id`,`game_package_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームパッケージグループとゲームパッケージの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_package_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_package_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ゲームパッケージグループID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '表示順',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文の引用元',
  `simple_shop_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '簡易ショップ表示',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='パッケージグループ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_package_sample_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_package_sample_images` (
  `game_package_id` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'パッケージID',
  `no` int(10) unsigned NOT NULL COMMENT '画像番号',
  `shop_id` int(10) unsigned NOT NULL COMMENT 'ショップID',
  `small_image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '小イメージURL',
  `large_image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '大イメージURL',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_package_id`,`no`) USING BTREE,
  KEY `game_soft_sample_images_package_id_shop_id_index` (`game_package_id`,`shop_id`) USING BTREE,
  KEY `game_soft_sample_images_package_id_index` (`game_package_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームパッケージのサンプルイメージ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_package_shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_package_shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `game_package_id` int(10) unsigned NOT NULL COMMENT 'ゲームパッケージID',
  `shop_id` int(10) unsigned NOT NULL COMMENT 'ショップID',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'URL',
  `img_tag` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '画像表示タグ',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `param1` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'パラメーター1',
  `param2` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'パラメーター2',
  `param3` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'パラメーター3',
  `updated_timestamp` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT 'データ更新日時',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_package_id` (`game_package_id`,`shop_id`),
  KEY `game_package_shops_shop_id_index` (`shop_id`),
  KEY `game_package_shops_updated_timestamp_index` (`updated_timestamp`),
  KEY `game_package_shops_shop_id_release_int_index` (`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームパッケージとショップの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_packages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ゲームパッケージID',
  `game_platform_id` int(10) unsigned NOT NULL COMMENT 'プラットフォームID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'パッケージ名称',
  `acronym` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '略称',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '表示順',
  `release_at` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '発売日',
  `img_shop_id` int(10) unsigned DEFAULT NULL COMMENT 'パッケージ画像表示ショップID',
  `default_img_type` smallint(5) unsigned NOT NULL DEFAULT 1 COMMENT 'デフォルト画像種別',
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームパッケージ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_platform_related_product_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_platform_related_product_links` (
  `game_platform_id` int(10) unsigned NOT NULL COMMENT 'プラットフォームID',
  `game_related_product_id` int(10) unsigned NOT NULL COMMENT '関連商品ID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_related_product_id`,`game_platform_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームプラットフォームと関連商品の紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_platform_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_platform_sites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `game_platform_id` int(10) unsigned NOT NULL COMMENT 'プラットフォームID',
  `node_name` varchar(200) NOT NULL COMMENT 'ノード表示用名称',
  `url` text NOT NULL COMMENT 'URL',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`),
  KEY `game_maker_id` (`game_platform_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ゲームプラットフォームのURL';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_platform_synonyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_platform_synonyms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `game_platform_id` bigint(20) unsigned NOT NULL COMMENT 'プラットフォームID',
  `synonym` varchar(100) NOT NULL DEFAULT '' COMMENT '俗称',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '作成日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `synonym` (`synonym`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ゲームプラットフォームの俗称';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_platforms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'プラットフォームID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'キー',
  `game_maker_id` int(10) unsigned DEFAULT NULL COMMENT 'ゲームメーカーID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'プラットフォーム名',
  `acronym` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '略称',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'タイトルノード表示用名称',
  `sort_order` int(10) unsigned NOT NULL COMMENT '表示順',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `game_platforms_sort_order_index` (`sort_order`),
  KEY `game_platforms_maker_id_index` (`game_maker_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームプラットフォーム';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_related_product_shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_related_product_shops` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `game_related_product_id` int(10) unsigned NOT NULL COMMENT '関連商品ID',
  `shop_id` int(10) unsigned NOT NULL COMMENT 'ショップID',
  `url` text NOT NULL COMMENT 'URL',
  `img_tag` text DEFAULT NULL COMMENT '画像表示用タグ',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `param1` varchar(100) DEFAULT NULL COMMENT 'パラメーター1',
  `param2` varchar(100) DEFAULT NULL COMMENT 'パラメーター2',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `shop` (`game_related_product_id`,`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='関連商品とショップ紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_related_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_related_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '関連商品ID',
  `name` varchar(200) NOT NULL COMMENT '名称',
  `node_name` varchar(200) NOT NULL COMMENT 'ノード表示用名称',
  `description` text NOT NULL DEFAULT '' COMMENT '説明',
  `description_source` text DEFAULT NULL COMMENT '説明の引用元',
  `rating` tinyint(3) NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '表示順',
  `img_shop_id` int(11) DEFAULT NULL COMMENT '画像表示用ショップID',
  `default_img_type` smallint(5) unsigned NOT NULL DEFAULT 1 COMMENT 'ショップ画像がないときのアイコン種別',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='関連商品';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_series` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'シリーズID',
  `game_franchise_id` int(10) unsigned DEFAULT NULL COMMENT 'フランチャイズID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'シリーズ名称',
  `phonetic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'シリーズ名称のよみがな',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文の引用元',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームシリーズ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_title_package_group_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_title_package_group_links` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `game_package_group_id` int(10) unsigned NOT NULL COMMENT 'パッケージグループID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_title_id`,`game_package_group_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームタイトルとパッケージグループの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_title_package_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_title_package_links` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `game_package_id` int(10) unsigned NOT NULL COMMENT 'パッケージID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_title_id`,`game_package_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームタイトルとゲームパッケージの紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_title_related_product_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_title_related_product_links` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'タイトルID',
  `game_related_product_id` int(10) unsigned NOT NULL COMMENT '関連商品ID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_related_product_id`,`game_title_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームタイトルと関連商品の紐づけ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_title_synonyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_title_synonyms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `game_title_id` bigint(20) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `synonym` varchar(100) NOT NULL DEFAULT '' COMMENT '俗称',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '作成日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `synonym` (`synonym`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ゲームタイトルの俗称';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_titles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'タイトルID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'キー',
  `game_franchise_id` int(10) unsigned DEFAULT NULL COMMENT 'フランチャイズID',
  `game_series_id` int(10) unsigned DEFAULT NULL COMMENT 'シリーズID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `phonetic` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'よみがな',
  `node_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'H1ノード表示用名称',
  `original_game_package_id` int(10) unsigned DEFAULT NULL COMMENT '原点のパッケージID',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文引用元',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `use_ogp_description` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'OGPの紹介文をあらすじに流用するフラグ',
  `first_release_int` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最初の発売日',
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `issue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ホラーゲームかどうかの疑義',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `game_softs_first_release_int_index` (`first_release_int`),
  KEY `game_softs_rating_index` (`rating`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ゲームタイトル';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `information` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `head` text NOT NULL COMMENT 'ヘッダ',
  `body` text NOT NULL COMMENT '本文',
  `priority` smallint(6) NOT NULL DEFAULT 100 COMMENT '優先度',
  `open_at` datetime NOT NULL COMMENT '掲載開始日時',
  `close_at` datetime NOT NULL COMMENT '掲載終了日時',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '作成日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`),
  KEY `open_at` (`open_at`,`close_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='お知らせ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `ogp_caches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ogp_caches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` char(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'URLのハッシュ',
  `base_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '入力元URL',
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'サイト名',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'URL',
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '画像URL',
  `type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'タイプ',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ogp_caches_hash_unique` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OGP情報のキャッシュ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `node_name` varchar(200) NOT NULL COMMENT 'ノード表示用名称',
  `h1_node_name` varchar(200) NOT NULL COMMENT 'H1ノード表示用名称',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='タグ';
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `show_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` smallint(5) unsigned NOT NULL,
  `adult` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `hgs12_user` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `profile` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `point` bigint(20) NOT NULL DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL,
  `sign_up_at` datetime DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_show_id_unique` (`show_id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

/*M!999999\- enable the sandbox mode */ 
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2024_09_17_054240_add_ogp_columns_to_game_titles_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2024_09_17_054659_create_ogp_caches_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2024_09_19_062100_add_ogp_columns_to_game_media_mixes_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2024_09_19_185120_add_ogp_columns_to_game_package_shops_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2024_09_19_185212_add_ogp_columns_to_game_related_product_shops_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2024_09_23_055512_add_ogp_columns_to_game_package_groups_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'2024_11_13_054014_update_rating_in_game_titles_table',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'2024_11_13_055228_add_issue_column_to_game_titles_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2024_11_13_055326_add_issue_column_to_game_titles_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2024_11_28_155440_add_base_url_to_ogp_caches_table',7);
