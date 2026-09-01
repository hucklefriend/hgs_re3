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
DROP TABLE IF EXISTS `contact_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_responses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contact_id` bigint(20) unsigned NOT NULL COMMENT '問い合わせID',
  `message` text NOT NULL COMMENT '返信内容',
  `responder_type` tinyint(4) NOT NULL COMMENT '0:管理者, 1:ユーザー, 2:システム',
  `user_id` bigint(20) unsigned DEFAULT NULL COMMENT '返信した管理者のユーザーID',
  `responder_name` varchar(255) DEFAULT NULL COMMENT '返信者名',
  `ip_address` varchar(45) DEFAULT NULL COMMENT '送信元IPアドレス',
  `user_agent` text DEFAULT NULL COMMENT 'ユーザーエージェント',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_responses_contact_id_foreign` (`contact_id`),
  CONSTRAINT `contact_responses_contact_id_foreign` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` tinyint(4) DEFAULT NULL,
  `message` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0:未対応, 1:対応中, 2:完了, 3:クローズ',
  `admin_notes` text DEFAULT NULL COMMENT '管理者メモ',
  `resolved_at` timestamp NULL DEFAULT NULL COMMENT '完了日時',
  `ip_address` varchar(45) DEFAULT NULL COMMENT '送信元IPアドレス',
  `user_agent` text DEFAULT NULL COMMENT 'ユーザーエージェント',
  `user_id` bigint(20) unsigned DEFAULT NULL COMMENT 'ログインユーザーID',
  `token` varchar(255) NOT NULL COMMENT '問い合わせ識別トークン',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contacts_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `email_change_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_change_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `new_email` varchar(255) NOT NULL,
  `token` varchar(128) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_change_requests_new_email_unique` (`new_email`),
  UNIQUE KEY `email_change_requests_token_unique` (`token`),
  KEY `email_change_requests_user_id_foreign` (`user_id`),
  CONSTRAINT `email_change_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
DROP TABLE IF EXISTS `fear_meter_statistics_dirty_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `fear_meter_statistics_dirty_titles` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_title_id`),
  KEY `fear_meter_statistics_dirty_titles_updated_at_index` (`updated_at`),
  CONSTRAINT `fear_meter_statistics_dirty_titles_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `fear_meter_statistics_run_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `fear_meter_statistics_run_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `last_completed_at` timestamp NULL DEFAULT NULL COMMENT '前回の集計完了日時',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
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
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_title_update_at` timestamp NULL DEFAULT NULL COMMENT '紐づくGameTitleの最終更新日時',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='ゲームフランチャイズデータ';
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
DROP TABLE IF EXISTS `game_makers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_makers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ゲーム会社ID',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'キー',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ゲーム会社名',
  `node_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'ノード表示用名称',
  `phonetic` varchar(200) DEFAULT NULL COMMENT 'よみがな',
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `type` int(11) NOT NULL COMMENT 'ゲームメーカー種別',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `search_synonyms` text DEFAULT NULL COMMENT '検索用俗称（改行区切り）',
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
  KEY `game_package_shops_shop_id_index` (`shop_id`),
  KEY `game_package_shops_updated_timestamp_index` (`updated_timestamp`),
  KEY `game_package_shops_shop_id_release_int_index` (`shop_id`),
  KEY `game_package_id` (`game_package_id`,`shop_id`) USING BTREE
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
  `type` int(11) NOT NULL COMMENT 'ゲームメーカー種別',
  `sort_order` int(10) unsigned NOT NULL COMMENT '表示順',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '説明',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明の引用元',
  `search_synonyms` text DEFAULT NULL COMMENT '検索用俗称（改行区切り）',
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
  `subtitle` varchar(50) DEFAULT NULL COMMENT 'サブタイトル',
  `url` text NOT NULL COMMENT 'URL',
  `img_tag` text DEFAULT NULL COMMENT '画像表示用タグ',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `param1` varchar(100) DEFAULT NULL COMMENT 'パラメーター1',
  `param2` varchar(100) DEFAULT NULL COMMENT 'パラメーター2',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '登録日時',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新日時',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `shop` (`game_related_product_id`,`shop_id`)
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
  `first_release_int` int(10) unsigned NOT NULL DEFAULT 0,
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
  `original_game_package_id` int(10) unsigned DEFAULT NULL COMMENT '原点のパッケージID',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文',
  `description_source` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '説明文引用元',
  `ogp_cache_id` bigint(20) unsigned DEFAULT NULL COMMENT 'OGPキャッシュID',
  `use_ogp_description` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'OGPの紹介文をあらすじに流用するフラグ',
  `first_release_int` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '最初の発売日',
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'レーティング',
  `issue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ホラーゲームかどうかの疑義',
  `search_synonyms` text DEFAULT NULL COMMENT '検索用俗称（改行区切り）',
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
  `header_text` text DEFAULT NULL,
  `sub_title_1` varchar(255) DEFAULT NULL,
  `sub_text_1` text DEFAULT NULL,
  `sub_title_2` varchar(255) DEFAULT NULL,
  `sub_text_2` text DEFAULT NULL,
  `sub_title_3` varchar(255) DEFAULT NULL,
  `sub_text_3` text DEFAULT NULL,
  `sub_title_4` varchar(255) DEFAULT NULL,
  `sub_text_4` text DEFAULT NULL,
  `sub_title_5` varchar(255) DEFAULT NULL,
  `sub_text_5` text DEFAULT NULL,
  `sub_title_6` varchar(255) DEFAULT NULL,
  `sub_text_6` text DEFAULT NULL,
  `sub_title_7` varchar(255) DEFAULT NULL,
  `sub_text_7` text DEFAULT NULL,
  `sub_title_8` varchar(255) DEFAULT NULL,
  `sub_text_8` text DEFAULT NULL,
  `sub_title_9` varchar(255) DEFAULT NULL,
  `sub_text_9` text DEFAULT NULL,
  `sub_title_10` varchar(255) DEFAULT NULL,
  `sub_text_10` text DEFAULT NULL,
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
DROP TABLE IF EXISTS `master_json_import_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_json_import_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` bigint(20) unsigned NOT NULL COMMENT '実行した管理者のユーザーID',
  `target_type` varchar(30) NOT NULL COMMENT '対象種別（title/media_mix）',
  `target_id` int(10) unsigned NOT NULL COMMENT '対象ID',
  `before_json` longtext NOT NULL COMMENT '適用前のシリアライズJSON',
  `imported_json` longtext NOT NULL COMMENT '貼り付けられたJSON',
  `applied_diff_json` longtext NOT NULL COMMENT '実際に採用された差分',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `master_json_import_logs_target_type_target_id_index` (`target_type`,`target_id`),
  KEY `master_json_import_logs_admin_user_id_foreign` (`admin_user_id`),
  CONSTRAINT `master_json_import_logs_admin_user_id_foreign` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
  `site_name` text DEFAULT NULL COMMENT 'サイト名',
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'URL',
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '画像URL',
  `image_width` int(11) DEFAULT NULL COMMENT '画像の幅',
  `image_height` int(11) DEFAULT NULL COMMENT '画像の高さ',
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
DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_resets_token_unique` (`token`),
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `review_statistics_dirty_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_statistics_dirty_titles` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_title_id`),
  KEY `review_statistics_dirty_titles_updated_at_index` (`updated_at`),
  CONSTRAINT `revdirt_title_fk` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `review_statistics_run_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_statistics_run_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `last_completed_at` timestamp NULL DEFAULT NULL COMMENT '前回の集計完了日時',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rss_article_matched_franchises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rss_article_matched_franchises` (
  `rss_article_id` bigint(20) unsigned NOT NULL,
  `game_franchise_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`rss_article_id`,`game_franchise_id`),
  KEY `rssamf_franchise_idx` (`game_franchise_id`),
  CONSTRAINT `rssamf_article_fk` FOREIGN KEY (`rss_article_id`) REFERENCES `rss_articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rssamf_franchise_fk` FOREIGN KEY (`game_franchise_id`) REFERENCES `game_franchises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rss_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rss_articles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rss_source` varchar(32) NOT NULL COMMENT 'RSSソース（RssSource Enumの値）',
  `guid` varchar(2048) NOT NULL COMMENT 'RSSのguid or link（重複判定キー）',
  `guid_hash` varchar(64) NOT NULL COMMENT '(rss_source, guid)のSHA256ハッシュ',
  `url` varchar(2048) NOT NULL COMMENT '記事URL',
  `url_hash` varchar(64) NOT NULL COMMENT 'urlのSHA256ハッシュ（OgpCache紐付け用）',
  `has_horror_keyword` tinyint(1) NOT NULL DEFAULT 0 COMMENT '「ホラーゲーム」を含むか',
  `published_at` timestamp NULL DEFAULT NULL COMMENT 'RSS配信日時',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rssart_source_guid_unique` (`rss_source`,`guid_hash`),
  KEY `rssart_published_idx` (`published_at`),
  KEY `rssart_source_idx` (`rss_source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `rss_fetch_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `rss_fetch_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rss_source` varchar(32) DEFAULT NULL COMMENT '取得ソース（NULL=全ソース）',
  `status` varchar(16) NOT NULL DEFAULT 'running' COMMENT 'running / success / error',
  `new_article_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '新着記事数',
  `error_message` text DEFAULT NULL COMMENT 'エラー内容',
  `started_at` timestamp NOT NULL COMMENT '取得開始日時',
  `finished_at` timestamp NULL DEFAULT NULL COMMENT '取得完了日時',
  PRIMARY KEY (`id`),
  KEY `rss_fetch_logs_started_at_index` (`started_at`),
  KEY `rss_fetch_logs_rss_source_index` (`rss_source`)
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
DROP TABLE IF EXISTS `shop_link_check_progresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_link_check_progresses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `source_table` varchar(50) NOT NULL,
  `last_checked_id` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_link_check_progresses_source_table_unique` (`source_table`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `shop_link_sold_out_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_link_sold_out_results` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `source_table` varchar(50) NOT NULL,
  `source_id` int(10) unsigned NOT NULL,
  `shop_id` int(10) unsigned NOT NULL,
  `url` text NOT NULL,
  `reason` varchar(10) NOT NULL,
  `matched_keyword` varchar(255) DEFAULT NULL,
  `detected_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_link_sold_out_results_source_table_source_id_unique` (`source_table`,`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `social_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `provider` tinyint(3) unsigned NOT NULL COMMENT 'SocialAccountProvider Enum',
  `provider_user_id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_provider_provider_user_id_unique` (`provider`,`provider_user_id`),
  KEY `social_accounts_user_id_foreign` (`user_id`),
  CONSTRAINT `social_accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
DROP TABLE IF EXISTS `temporary_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `temporary_registrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `resend_count` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `temporary_registrations_email_unique` (`email`),
  UNIQUE KEY `temporary_registrations_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `event_type` varchar(32) NOT NULL COMMENT 'イベント種別（TimelineEventType）',
  `actor_type` varchar(16) DEFAULT NULL COMMENT 'アクター種別（TimelineActorType）',
  `actor_id` bigint(20) unsigned DEFAULT NULL COMMENT 'アクターID（actor_type=user のとき users.id）',
  `subject_type` varchar(32) NOT NULL COMMENT 'サブジェクト種別（TimelineSubjectType）',
  `subject_id` bigint(20) unsigned NOT NULL COMMENT 'サブジェクトID（subject_type に対応するID）',
  `recipient_user_id` bigint(20) unsigned DEFAULT NULL COMMENT '通知先ユーザーID（通知系イベント共通）',
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '付随情報（怖さメーターラベルなど）' CHECK (json_valid(`payload`)),
  `created_at` timestamp NOT NULL COMMENT 'イベント発生日時',
  PRIMARY KEY (`id`),
  KEY `tlevt_actor_idx` (`actor_type`,`actor_id`,`created_at`),
  KEY `tlevt_subject_idx` (`subject_type`,`subject_id`,`created_at`),
  KEY `tlevt_recipient_idx` (`recipient_user_id`,`created_at`),
  KEY `tlevt_actor_fk` (`actor_id`),
  CONSTRAINT `tlevt_actor_fk` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tlevt_recipient_fk` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `title_fear_meter_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `title_fear_meter_statistics` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00 COMMENT '平均評価（0.00-4.00）',
  `fear_meter` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `total_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価総数',
  `rating_0_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価0の数',
  `rating_1_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価1の数',
  `rating_2_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価2の数',
  `rating_3_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価3の数',
  `rating_4_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '評価4の数',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最終更新日時',
  PRIMARY KEY (`game_title_id`),
  CONSTRAINT `game_title_fear_meter_statistics_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `title_review_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `title_review_statistics` (
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `review_count` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '公開済みレビュー件数',
  `avg_total_score` decimal(5,2) DEFAULT NULL COMMENT '総合スコア平均（0〜100）',
  `avg_story` decimal(4,2) DEFAULT NULL COMMENT 'ストーリー平均（0〜4）',
  `avg_atmosphere` decimal(4,2) DEFAULT NULL COMMENT '雰囲気・演出平均（0〜4）',
  `avg_gameplay` decimal(4,2) DEFAULT NULL COMMENT 'ゲーム性平均（0〜4）',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最終更新日時',
  PRIMARY KEY (`game_title_id`),
  CONSTRAINT `gtrstat_title_fk` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `two_factor_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `two_factor_auth_codes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `code` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `failed_attempts` tinyint(4) NOT NULL DEFAULT 0,
  `resend_count` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `two_factor_auth_codes_user_id_foreign` (`user_id`),
  CONSTRAINT `two_factor_auth_codes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `two_factor_recovery_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `two_factor_recovery_codes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `code` varchar(64) NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `two_factor_recovery_codes_user_id_foreign` (`user_id`),
  CONSTRAINT `two_factor_recovery_codes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_blocks` (
  `blocker_id` bigint(20) unsigned NOT NULL COMMENT 'ブロックするユーザーID',
  `blocked_id` bigint(20) unsigned NOT NULL COMMENT 'ブロックされるユーザーID',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`blocker_id`,`blocked_id`),
  KEY `user_blocks_blocked_idx` (`blocked_id`),
  CONSTRAINT `ub_blocked_fk` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ub_blocker_fk` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_favorite_game_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorite_game_titles` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`game_title_id`),
  KEY `user_favorite_game_titles_game_title_id_foreign` (`game_title_id`),
  CONSTRAINT `user_favorite_game_titles_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorite_game_titles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_fear_meter_restrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_fear_meter_restrictions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '対象ユーザーID',
  `reason` varchar(255) DEFAULT NULL COMMENT '理由',
  `source` varchar(30) NOT NULL DEFAULT 'manual' COMMENT '制限ソース',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '有効フラグ',
  `started_at` timestamp NOT NULL COMMENT '開始日時',
  `ended_at` timestamp NULL DEFAULT NULL COMMENT '終了日時',
  `created_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT '作成管理者ID',
  `released_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT '解除管理者ID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ufmr_user_active_started_idx` (`user_id`,`is_active`,`started_at`),
  KEY `ufmr_created_admin_fk` (`created_by_admin_id`),
  KEY `ufmr_released_admin_fk` (`released_by_admin_id`),
  CONSTRAINT `ufmr_created_admin_fk` FOREIGN KEY (`created_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ufmr_released_admin_fk` FOREIGN KEY (`released_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ufmr_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follows` (
  `follower_id` bigint(20) unsigned NOT NULL COMMENT 'フォローするユーザーID',
  `following_id` bigint(20) unsigned NOT NULL COMMENT 'フォローされるユーザーID',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`follower_id`,`following_id`),
  KEY `user_follows_following_idx` (`following_id`),
  CONSTRAINT `uf_follower_fk` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uf_following_fk` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_fear_meter_comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_fear_meter_comment_likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `fear_meter_log_id` bigint(20) unsigned NOT NULL COMMENT '怖さメーターログID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'いいねしたユーザーID',
  `created_at` timestamp NOT NULL COMMENT '作成日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtfmcl_log_user_unique` (`fear_meter_log_id`,`user_id`),
  KEY `user_game_title_fear_meter_comment_likes_fear_meter_log_id_index` (`fear_meter_log_id`),
  KEY `user_game_title_fear_meter_comment_likes_user_id_index` (`user_id`),
  CONSTRAINT `ugtfmcl_log_fk` FOREIGN KEY (`fear_meter_log_id`) REFERENCES `user_game_title_fear_meter_logs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtfmcl_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_fear_meter_comment_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_fear_meter_comment_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `fear_meter_log_id` bigint(20) unsigned NOT NULL COMMENT '怖さメーターログID',
  `reporter_user_id` bigint(20) unsigned NOT NULL COMMENT '通報者ユーザーID',
  `reason` varchar(255) DEFAULT NULL COMMENT '通報理由',
  `status` varchar(20) NOT NULL DEFAULT 'open' COMMENT '通報ステータス',
  `reviewed_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT 'レビューした管理者ID',
  `reviewed_at` timestamp NULL DEFAULT NULL COMMENT 'レビュー日時',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtfmcr_log_reporter_unique` (`fear_meter_log_id`,`reporter_user_id`),
  KEY `ugtfmcr_status_created_at_idx` (`status`,`created_at`),
  KEY `ugtfmcr_log_idx` (`fear_meter_log_id`),
  KEY `ugtfmcr_reporter_fk` (`reporter_user_id`),
  KEY `ugtfmcr_reviewed_admin_fk` (`reviewed_by_admin_id`),
  CONSTRAINT `ugtfmcr_log_fk` FOREIGN KEY (`fear_meter_log_id`) REFERENCES `user_game_title_fear_meter_logs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtfmcr_reporter_fk` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtfmcr_reviewed_admin_fk` FOREIGN KEY (`reviewed_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_fear_meter_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_fear_meter_drafts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `fear_meter` tinyint(3) unsigned NOT NULL COMMENT '怖さ評価値（0-4）',
  `comment` varchar(100) DEFAULT NULL COMMENT '一言コメント',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_game_title_fear_meter_drafts_user_id_game_title_id_unique` (`user_id`,`game_title_id`),
  KEY `user_game_title_fear_meter_drafts_game_title_id_foreign` (`game_title_id`),
  CONSTRAINT `user_game_title_fear_meter_drafts_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_game_title_fear_meter_drafts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_fear_meter_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_fear_meter_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `old_fear_meter` tinyint(3) unsigned DEFAULT NULL COMMENT '変更前の怖さ評価値（0-4、初回登録時はNULL）',
  `new_fear_meter` tinyint(3) unsigned NOT NULL COMMENT '変更後の怖さ評価値（0-4）',
  `comment` varchar(100) DEFAULT NULL COMMENT '一言コメント',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除フラグ',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '削除日時',
  `deleted_by_user_id` bigint(20) unsigned DEFAULT NULL COMMENT '削除したユーザーID',
  `deleted_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT '削除した管理者ID',
  `action` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT '操作種別（1=新規登録, 2=編集, 3=削除）',
  `created_at` timestamp NOT NULL COMMENT '変更日時',
  PRIMARY KEY (`id`),
  KEY `user_game_title_fear_meter_logs_user_id_index` (`user_id`),
  KEY `user_game_title_fear_meter_logs_game_title_id_index` (`game_title_id`),
  KEY `user_game_title_fear_meter_logs_created_at_index` (`created_at`),
  KEY `ugtfml_game_title_created_at_idx` (`game_title_id`,`created_at`),
  KEY `ugtfml_title_deleted_created_at_idx` (`game_title_id`,`is_deleted`,`created_at`),
  KEY `ugtfml_user_title_id_idx` (`user_id`,`game_title_id`,`id`),
  KEY `ugtfml_deleted_by_user_fk` (`deleted_by_user_id`),
  KEY `ugtfml_deleted_by_admin_fk` (`deleted_by_admin_id`),
  CONSTRAINT `ugtfml_deleted_by_admin_fk` FOREIGN KEY (`deleted_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ugtfml_deleted_by_user_fk` FOREIGN KEY (`deleted_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `user_game_title_fear_meter_logs_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_game_title_fear_meter_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_fear_meters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_fear_meters` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `fear_meter` tinyint(3) unsigned NOT NULL COMMENT '怖さ評価値（0-4）',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`game_title_id`),
  KEY `user_game_title_fear_meters_user_id_index` (`user_id`),
  KEY `user_game_title_fear_meters_game_title_id_index` (`game_title_id`),
  KEY `user_game_title_fear_meters_updated_at_game_title_id_index` (`updated_at`,`game_title_id`),
  CONSTRAINT `user_game_title_fear_meters_game_title_id_foreign` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_game_title_fear_meters_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_draft_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_draft_packages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `draft_id` bigint(20) unsigned NOT NULL COMMENT '下書きID',
  `game_package_id` int(10) unsigned NOT NULL COMMENT 'ゲームパッケージID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevdftpkg_dft_pkg_unique` (`draft_id`,`game_package_id`),
  KEY `ugtrevdftpkg_dft_idx` (`draft_id`),
  KEY `ugtrevdftpkg_pkg_fk` (`game_package_id`),
  CONSTRAINT `ugtrevdftpkg_dft_fk` FOREIGN KEY (`draft_id`) REFERENCES `user_game_title_review_drafts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevdftpkg_pkg_fk` FOREIGN KEY (`game_package_id`) REFERENCES `game_packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_drafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_drafts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `review_id` bigint(20) unsigned DEFAULT NULL COMMENT 'レビューID（NULLなら新規投稿の下書き、値ありなら編集中の下書き）',
  `play_status` varchar(32) DEFAULT NULL COMMENT 'プレイ状況',
  `body` text DEFAULT NULL COMMENT '本文',
  `has_spoiler` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ネタバレフラグ',
  `score_story` tinyint(3) unsigned DEFAULT NULL COMMENT 'ストーリースコア（0〜4）',
  `score_atmosphere` tinyint(3) unsigned DEFAULT NULL COMMENT '雰囲気・演出スコア（0〜4）',
  `score_gameplay` tinyint(3) unsigned DEFAULT NULL COMMENT 'ゲーム性スコア（0〜4）',
  `user_score_adjustment` smallint(6) DEFAULT NULL COMMENT 'ユーザー調整値（−20〜+20）',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevdft_user_title_unique` (`user_id`,`game_title_id`),
  KEY `ugtrevdft_user_idx` (`user_id`),
  KEY `ugtrevdft_title_idx` (`game_title_id`),
  KEY `ugtrevdft_rev_fk` (`review_id`),
  CONSTRAINT `ugtrevdft_rev_fk` FOREIGN KEY (`review_id`) REFERENCES `user_game_title_reviews` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevdft_title_fk` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevdft_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'いいねしたユーザーID',
  `review_id` bigint(20) unsigned NOT NULL COMMENT 'レビューID',
  `review_log_id` bigint(20) unsigned NOT NULL COMMENT 'いいねした時点のバージョンID',
  `created_at` timestamp NOT NULL COMMENT '作成日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevlk_user_rev_unique` (`user_id`,`review_id`),
  KEY `ugtrevlk_rev_idx` (`review_id`),
  KEY `ugtrevlk_user_idx` (`user_id`),
  KEY `ugtrevlk_log_fk` (`review_log_id`),
  CONSTRAINT `ugtrevlk_log_fk` FOREIGN KEY (`review_log_id`) REFERENCES `user_game_title_review_logs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevlk_rev_fk` FOREIGN KEY (`review_id`) REFERENCES `user_game_title_reviews` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevlk_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID（バージョンIDとして使用）',
  `review_id` bigint(20) unsigned NOT NULL COMMENT 'レビューID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `version` int(10) unsigned NOT NULL COMMENT 'レビューごとの連番（1始まり）',
  `play_status` varchar(32) NOT NULL COMMENT 'プレイ状況',
  `game_package_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ゲームパッケージIDの配列（スナップショット）' CHECK (json_valid(`game_package_ids`)),
  `body` text NOT NULL COMMENT '本文',
  `has_spoiler` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ネタバレフラグ',
  `score_story` tinyint(3) unsigned DEFAULT NULL COMMENT 'ストーリースコア（0〜4）',
  `score_atmosphere` tinyint(3) unsigned DEFAULT NULL COMMENT '雰囲気・演出スコア（0〜4）',
  `score_gameplay` tinyint(3) unsigned DEFAULT NULL COMMENT 'ゲーム性スコア（0〜4）',
  `user_score_adjustment` smallint(6) DEFAULT NULL COMMENT 'ユーザー調整値（−20〜+20）',
  `base_score` tinyint(3) unsigned DEFAULT NULL COMMENT 'ベーススコア（0〜100）',
  `total_score` tinyint(3) unsigned DEFAULT NULL COMMENT '総合スコア（0〜100）',
  `created_at` timestamp NOT NULL COMMENT '編集日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevlog_rev_ver_unique` (`review_id`,`version`),
  KEY `ugtrevlog_rev_idx` (`review_id`),
  KEY `ugtrevlog_user_idx` (`user_id`),
  CONSTRAINT `ugtrevlog_rev_fk` FOREIGN KEY (`review_id`) REFERENCES `user_game_title_reviews` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevlog_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_packages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `review_id` bigint(20) unsigned NOT NULL COMMENT 'レビューID',
  `game_package_id` int(10) unsigned NOT NULL COMMENT 'ゲームパッケージID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevpkg_rev_pkg_unique` (`review_id`,`game_package_id`),
  KEY `ugtrevpkg_rev_idx` (`review_id`),
  KEY `ugtrevpkg_pkg_fk` (`game_package_id`),
  CONSTRAINT `ugtrevpkg_pkg_fk` FOREIGN KEY (`game_package_id`) REFERENCES `game_packages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevpkg_rev_fk` FOREIGN KEY (`review_id`) REFERENCES `user_game_title_reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_review_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_review_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) unsigned NOT NULL COMMENT '通報者ユーザーID',
  `review_id` bigint(20) unsigned NOT NULL COMMENT 'レビューID',
  `review_log_id` bigint(20) unsigned NOT NULL COMMENT '通報時点のバージョンID',
  `reason` text DEFAULT NULL COMMENT '通報理由',
  `is_resolved` tinyint(1) NOT NULL DEFAULT 0 COMMENT '対応済みフラグ',
  `resolved_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT '対応した管理者ID',
  `resolved_at` timestamp NULL DEFAULT NULL COMMENT '対応日時',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrevrpt_user_rev_unique` (`user_id`,`review_id`),
  KEY `ugtrevrpt_rev_idx` (`review_id`),
  KEY `ugtrevrpt_resolved_created_idx` (`is_resolved`,`created_at`),
  KEY `ugtrevrpt_log_fk` (`review_log_id`),
  KEY `ugtrevrpt_admin_fk` (`resolved_by_admin_id`),
  CONSTRAINT `ugtrevrpt_admin_fk` FOREIGN KEY (`resolved_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ugtrevrpt_log_fk` FOREIGN KEY (`review_log_id`) REFERENCES `user_game_title_review_logs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevrpt_rev_fk` FOREIGN KEY (`review_id`) REFERENCES `user_game_title_reviews` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrevrpt_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_game_title_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_title_reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `key` varchar(20) DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `game_title_id` int(10) unsigned NOT NULL COMMENT 'ゲームタイトルID',
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0 COMMENT '管理者による非表示フラグ',
  `hidden_by_admin_id` bigint(20) unsigned DEFAULT NULL COMMENT '非表示にした管理者ID',
  `hidden_at` timestamp NULL DEFAULT NULL COMMENT '非表示にした日時',
  `play_status` varchar(32) NOT NULL COMMENT 'プレイ状況',
  `body` text NOT NULL COMMENT '本文（〜2000文字）',
  `has_spoiler` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ネタバレフラグ',
  `score_story` tinyint(3) unsigned DEFAULT NULL COMMENT 'ストーリースコア（0〜4）',
  `score_atmosphere` tinyint(3) unsigned DEFAULT NULL COMMENT '雰囲気・演出スコア（0〜4）',
  `score_gameplay` tinyint(3) unsigned DEFAULT NULL COMMENT 'ゲーム性スコア（0〜4）',
  `user_score_adjustment` smallint(6) DEFAULT NULL COMMENT 'ユーザー調整値（−20〜+20）',
  `base_score` tinyint(3) unsigned DEFAULT NULL COMMENT 'ベーススコア（0〜100）',
  `total_score` tinyint(3) unsigned DEFAULT NULL COMMENT '総合スコア（0〜100）',
  `current_log_id` bigint(20) unsigned DEFAULT NULL COMMENT '現在の公開バージョンのログID',
  `ogp_image_filename` varchar(255) DEFAULT NULL COMMENT 'OGP画像パス',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ユーザーによるソフトデリートフラグ',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ugtrev_user_title_unique` (`user_id`,`game_title_id`),
  UNIQUE KEY `user_game_title_reviews_key_unique` (`key`),
  KEY `ugtrev_user_idx` (`user_id`),
  KEY `ugtrev_title_idx` (`game_title_id`),
  KEY `ugtrev_title_visible_idx` (`game_title_id`,`is_deleted`,`is_hidden`),
  KEY `ugtrev_admin_fk` (`hidden_by_admin_id`),
  CONSTRAINT `ugtrev_admin_fk` FOREIGN KEY (`hidden_by_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ugtrev_title_fk` FOREIGN KEY (`game_title_id`) REFERENCES `game_titles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ugtrev_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_mutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_mutes` (
  `muter_id` bigint(20) unsigned NOT NULL COMMENT 'ミュートするユーザーID',
  `muted_id` bigint(20) unsigned NOT NULL COMMENT 'ミュートされるユーザーID',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`muter_id`,`muted_id`),
  KEY `user_mutes_muted_idx` (`muted_id`),
  CONSTRAINT `um_muted_fk` FOREIGN KEY (`muted_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `um_muter_fk` FOREIGN KEY (`muter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_timeline_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_timeline_settings` (
  `user_id` bigint(20) unsigned NOT NULL COMMENT 'ユーザーID',
  `show_horror_keyword_rss` tinyint(1) NOT NULL DEFAULT 1 COMMENT '「ホラーゲーム」キーワードでマッチしたRSS記事を表示するか',
  `show_favorite_franchise_rss` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'お気に入りタイトル（フランチャイズ）にマッチしたRSS記事を表示するか',
  `show_followed_user_activity` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'フォロー中ユーザーの活動（レビュー・怖さメーター）を表示するか',
  `publish_activity_to_root` tinyint(1) NOT NULL DEFAULT 1 COMMENT '自分のレビュー・怖さメーター更新をルートタイムラインに掲載するか',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `utls_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `avatar_filename` varchar(255) DEFAULT NULL COMMENT 'アバター画像ファイル名。nullの場合はGravatarを表示',
  `bio` varchar(200) DEFAULT NULL,
  `point` bigint(20) NOT NULL DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL,
  `sign_up_at` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_verification_sent_at` timestamp NULL DEFAULT NULL,
  `withdrawn_at` timestamp NULL DEFAULT NULL,
  `privacy_policy_accepted_version` int(10) unsigned NOT NULL DEFAULT 0,
  `password` varchar(255) DEFAULT NULL,
  `two_factor_method` varchar(255) DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
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
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2025_09_07_062245_add_image_dimensions_to_ogp_caches_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2025_10_01_164119_add_site_name_to_ogp_caches_table',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2025_10_06_063607_modify_game_related_product_shops_table',10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17,'2025_10_09_175725_modify_game_makers_table_add_type_column',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2025_10_09_180032_modify_game_platforms_table_add_type_column',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2025_10_09_180500_drop_game_main_network_tables',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20,'2025_10_09_190249_drop_h1_node_name_from_game_titles_table',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21,'2025_10_09_192311_drop_h1_node_name_from_game_media_mixes_and_game_related_products_table',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22,'2025_10_10_055307_drop_game_title_package_links_table',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2025_10_15_063254_add_phonetic_and_rating_to_game_makers_table',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2025_10_15_063644_modify_game_franchises_table_add_rating_drop_h1_node_name',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25,'2025_10_16_171632_create_contacts_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26,'2025_10_16_173238_create_contact_responses_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27,'2025_10_16_190819_add_resolved_at_to_contacts_table',17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28,'2025_10_19_054918_remove_subject_from_contacts_table',18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29,'2025_10_19_055459_change_category_to_int_in_contacts_table',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30,'2025_10_25_055504_remove_img_shop_id_from_game_related_products_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31,'2025_10_25_060823_remove_img_shop_id_from_game_packages_table',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32,'2025_11_03_060507_add_first_release_int_to_game_series_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33,'2025_11_05_061227_add_email_verification_to_users_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2025_11_06_181529_create_temporary_registrations_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2025_11_06_182905_add_resend_count_to_temporary_registrations_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (36,'2025_11_07_000000_add_withdrawn_at_to_users_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (37,'2025_11_11_060855_remove_email_verified_at_from_users_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (38,'2025_11_11_070000_create_email_change_requests_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (39,'2025_11_16_060415_create_password_resets_table',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (40,'2025_11_17_054608_add_privacy_policy_accepted_version_to_users_table',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (41,'2025_11_18_055008_create_user_favorite_game_titles_table',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (42,'2026_01_10_064613_add_title_synonyms_to_game_titles_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (43,'2026_01_10_064614_drop_game_title_synonyms_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (44,'2026_01_10_064613_add_search_synonyms_to_game_titles_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2026_01_15_100000_create_user_game_title_fear_meters_table',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (49,'2026_01_15_100001_create_game_title_fear_meter_statistics_table',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2026_01_15_100002_create_user_game_title_fear_meter_logs_table',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (51,'2026_01_15_100003_add_fear_meter_to_game_title_fear_meter_statistics_table',32);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (52,'2026_02_05_100000_create_fear_meter_statistics_run_log_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (53,'2026_02_05_100001_add_updated_at_game_title_id_index_to_user_game_title_fear_meters_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (54,'2026_02_20_100000_update_informations_table_add_header_text_and_sub_items',34);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (55,'2026_02_23_070034_create_social_accounts_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (56,'2026_02_23_070045_make_password_nullable_in_users_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (57,'2026_03_03_100000_add_last_title_update_at_to_game_franchises_table',36);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (58,'2026_03_03_100001_backfill_last_title_update_at_on_game_franchises',37);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (59,'2026_03_18_181300_create_personal_access_tokens_table',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (60,'2026_03_23_120000_add_comment_and_delete_flags_to_user_game_title_fear_meter_logs_table',39);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (61,'2026_03_23_130000_create_fear_meter_statistics_dirty_titles_table',40);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (62,'2026_03_23_140000_create_fear_meter_comment_likes_table',41);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (63,'2026_03_23_140001_create_fear_meter_comment_reports_table',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (64,'2026_03_23_140002_create_user_fear_meter_restrictions_table',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (65,'2026_04_03_060051_make_email_nullable_in_users_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (66,'2026_04_07_054506_add_two_factor_method_to_users_table',44);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (67,'2026_04_07_054506_create_two_factor_auth_codes_table',44);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (68,'2026_04_07_060000_add_two_factor_secret_to_users_table',45);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (69,'2026_04_08_000000_create_two_factor_recovery_codes_table',46);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (70,'2026_04_10_100000_create_user_game_title_reviews_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (71,'2026_04_10_100001_create_user_game_title_review_packages_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (72,'2026_04_10_100002_create_user_game_title_review_horror_type_tags_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (73,'2026_04_10_100003_create_user_game_title_review_logs_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (74,'2026_04_10_100004_create_user_game_title_review_drafts_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (75,'2026_04_10_100005_create_user_game_title_review_draft_packages_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (76,'2026_04_10_100006_create_user_game_title_review_draft_horror_type_tags_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (77,'2026_04_10_100007_create_user_game_title_review_likes_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (78,'2026_04_10_100008_create_user_game_title_review_reports_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (79,'2026_04_10_100009_create_game_title_review_statistics_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (80,'2026_04_10_100010_create_review_statistics_dirty_titles_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (81,'2026_04_10_100011_create_review_statistics_run_log_table',47);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (82,'2026_04_10_100012_add_action_to_user_game_title_fear_meter_logs_table',48);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (83,'2026_04_15_000000_drop_play_time_from_review_tables',49);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (84,'2026_04_15_000001_rename_ogp_image_path_to_ogp_image_filename_in_reviews_table',50);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (85,'2026_04_15_100002_convert_score_fields_to_point_values',51);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (86,'2026_04_17_061516_add_key_to_user_game_title_reviews_table',52);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (87,'2026_04_24_053805_create_user_game_title_fear_meter_drafts_table',53);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (88,'2026_04_26_051825_drop_horror_type_tags_tables',54);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (89,'2026_05_13_000001_create_shop_link_check_progresses_table',55);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (94,'2026_05_13_000002_create_shop_link_sold_out_results_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (95,'2026_05_19_000001_create_timeline_events_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (96,'2026_06_01_000001_create_rss_sources_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (97,'2026_06_01_000002_create_rss_articles_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (98,'2026_06_01_000003_create_rss_article_matched_titles_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (99,'2026_06_01_000004_create_rss_article_matched_franchises_table',56);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (100,'2026_06_01_000005_switch_rss_source_from_table_to_enum',57);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (101,'2026_06_02_000001_create_user_timeline_settings_table',58);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (102,'2026_06_03_000001_drop_rss_article_matched_titles_table',59);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (103,'2026_06_04_000001_create_rss_fetch_logs_table',60);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (104,'2026_06_05_000001_add_avatar_filename_to_users_table',61);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (105,'2026_06_05_000002_create_user_follows_table',61);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (106,'2026_06_05_000003_create_user_blocks_table',61);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (107,'2026_06_05_000004_create_user_mutes_table',61);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (108,'2026_06_06_000001_add_bio_to_users_table',62);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (109,'2026_06_09_000001_seed_user_registered_timeline_events',63);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (110,'2026_06_19_000001_create_master_json_import_logs_table',63);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (111,'2026_07_09_000001_rename_game_title_statistics_tables',64);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (112,'2026_07_10_000001_add_search_synonyms_to_game_makers_table',65);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (113,'2026_07_10_000002_drop_game_maker_synonyms_table',65);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (114,'2026_07_10_000003_add_search_synonyms_to_game_platforms_table',65);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (115,'2026_07_10_000004_drop_game_platform_synonyms_table',65);
