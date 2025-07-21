-- CreateTable
CREATE TABLE "motherboards" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "socket" TEXT,
    "chipset" TEXT,
    "form_factor" TEXT,
    "memory_max" INTEGER,
    "memory_slots" INTEGER,
    "memory_type" TEXT,
    "pcie_x16_slots" INTEGER,
    "pcie_x8_slots" INTEGER,
    "pcie_x4_slots" INTEGER,
    "pcie_x1_slots" INTEGER,
    "pcie_gen" TEXT,
    "m2_slots_total" INTEGER,
    "m2_slots_pcie" INTEGER,
    "m2_slots_sata" INTEGER,
    "sata_6gb_ports" INTEGER,
    "sata_3gb_ports" INTEGER,
    "usb_2_headers" INTEGER,
    "usb_3_gen1_headers" INTEGER,
    "usb_3_gen2_headers" INTEGER,
    "usb_c_headers" INTEGER,
    "wifi_integrated" BOOLEAN,
    "bluetooth_integrated" BOOLEAN,
    "ethernet_speed" TEXT,
    "audio_chipset" TEXT,
    "audio_channels" TEXT,
    "ecc_support" BOOLEAN,
    "raid_support" BOOLEAN,
    "overclocking_support" BOOLEAN,
    "bios_flashback" BOOLEAN,
    "clear_cmos" BOOLEAN,
    "dual_bios" BOOLEAN,
    "color" TEXT[],
    "rgb_lighting" BOOLEAN,
    "back_connect" BOOLEAN,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "pcie_slots_detailed" JSONB,
    "m2_slots_detailed" JSONB,
    "back_panel_ports" JSONB,
    "usb_headers_detailed" JSONB,
    "storage_detailed" JSONB,
    "onboard_ethernet" JSONB,
    "bios_features" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motherboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pc_cases" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "form_factor" TEXT,
    "supports_atx" BOOLEAN,
    "supports_matx" BOOLEAN,
    "supports_mitx" BOOLEAN,
    "supports_eatx" BOOLEAN,
    "max_gpu_length" INTEGER,
    "max_cpu_cooler_height" INTEGER,
    "psu_included" BOOLEAN,
    "psu_form_factors" TEXT[],
    "max_psu_length" INTEGER,
    "expansion_slots" INTEGER,
    "drive_bays_3_5" INTEGER,
    "drive_bays_2_5" INTEGER,
    "drive_bays_5_25" INTEGER,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "volume" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "side_panel_type" TEXT,
    "has_tempered_glass" BOOLEAN,
    "color" TEXT[],
    "front_usb_2_0" INTEGER,
    "front_usb_3_0" INTEGER,
    "front_usb_3_1" INTEGER,
    "front_usb_3_2" INTEGER,
    "front_usb_c" INTEGER,
    "front_audio_ports" INTEGER,
    "fan_mounts_120mm" INTEGER,
    "fan_mounts_140mm" INTEGER,
    "radiator_support_240mm" BOOLEAN,
    "radiator_support_280mm" BOOLEAN,
    "radiator_support_360mm" BOOLEAN,
    "dust_filters" BOOLEAN,
    "tool_free_installation" BOOLEAN,
    "cable_management" BOOLEAN,
    "rgb_lighting" BOOLEAN,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "dimensions_detailed" JSONB,
    "front_panel_detailed" JSONB,
    "cooling_support" JSONB,
    "motherboard_support" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pc_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psus" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "wattage" INTEGER,
    "form_factor" TEXT,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "connector_atx_24pin" INTEGER,
    "connector_eps_8pin" INTEGER,
    "connector_eps_4pin" INTEGER,
    "connector_pcie_8pin" INTEGER,
    "connector_pcie_6pin" INTEGER,
    "connector_pcie_6plus2" INTEGER,
    "connector_pcie_12vhpwr" INTEGER,
    "connector_pcie_12v_2x6" INTEGER,
    "connector_sata" INTEGER,
    "connector_molex_4pin" INTEGER,
    "connector_floppy_4pin" INTEGER,
    "efficiency_rating" TEXT,
    "efficiency_percent" DOUBLE PRECISION,
    "modular_type" TEXT,
    "fanless" BOOLEAN,
    "fan_size" INTEGER,
    "operating_temp_max" INTEGER,
    "ocp_protection" BOOLEAN,
    "ovp_protection" BOOLEAN,
    "opp_protection" BOOLEAN,
    "scp_protection" BOOLEAN,
    "rail_12v_amps" DOUBLE PRECISION,
    "rail_5v_amps" DOUBLE PRECISION,
    "rail_3_3v_amps" DOUBLE PRECISION,
    "color" TEXT[],
    "rgb_lighting" BOOLEAN,
    "certifications" TEXT[],
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "connectors_detailed" JSONB,
    "power_rails" JSONB,
    "protections" JSONB,
    "dimensions_detailed" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ram_modules" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "ram_type" TEXT,
    "form_factor" TEXT,
    "modules_quantity" INTEGER,
    "module_capacity" INTEGER,
    "total_capacity" INTEGER,
    "speed_mhz" INTEGER,
    "cas_latency" INTEGER,
    "timing_trcd" INTEGER,
    "timing_trp" INTEGER,
    "timing_tras" INTEGER,
    "voltage" DOUBLE PRECISION,
    "ecc_support" BOOLEAN,
    "registered" BOOLEAN,
    "heat_spreader" BOOLEAN,
    "rgb_lighting" BOOLEAN,
    "color" TEXT[],
    "xmp_profile" BOOLEAN,
    "docp_profile" BOOLEAN,
    "expo_profile" BOOLEAN,
    "jedec_standard" BOOLEAN,
    "height_mm" INTEGER,
    "warranty_years" INTEGER,
    "lifetime_warranty" BOOLEAN,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "timings_detailed" JSONB,
    "overclocking_profiles" JSONB,
    "test_results" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ram_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "capacity_gb" INTEGER,
    "capacity_tb" DOUBLE PRECISION,
    "storage_type" TEXT,
    "is_nvme" BOOLEAN,
    "is_ssd" BOOLEAN,
    "form_factor" TEXT,
    "interface" TEXT,
    "interface_type" TEXT,
    "interface_version" TEXT,
    "rpm" INTEGER,
    "read_speed_mbps" INTEGER,
    "write_speed_mbps" INTEGER,
    "cache_mb" INTEGER,
    "tbw" INTEGER,
    "mtbf_hours" INTEGER,
    "power_consumption_watts" DOUBLE PRECISION,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motherboards_opendb_id_key" ON "motherboards"("opendb_id");

-- CreateIndex
CREATE INDEX "motherboards_socket_idx" ON "motherboards"("socket");

-- CreateIndex
CREATE INDEX "motherboards_chipset_idx" ON "motherboards"("chipset");

-- CreateIndex
CREATE INDEX "motherboards_form_factor_idx" ON "motherboards"("form_factor");

-- CreateIndex
CREATE INDEX "motherboards_memory_type_idx" ON "motherboards"("memory_type");

-- CreateIndex
CREATE INDEX "motherboards_memory_slots_idx" ON "motherboards"("memory_slots");

-- CreateIndex
CREATE INDEX "motherboards_pcie_x16_slots_idx" ON "motherboards"("pcie_x16_slots");

-- CreateIndex
CREATE INDEX "motherboards_pcie_gen_idx" ON "motherboards"("pcie_gen");

-- CreateIndex
CREATE INDEX "motherboards_m2_slots_total_idx" ON "motherboards"("m2_slots_total");

-- CreateIndex
CREATE INDEX "motherboards_sata_6gb_ports_idx" ON "motherboards"("sata_6gb_ports");

-- CreateIndex
CREATE INDEX "motherboards_wifi_integrated_idx" ON "motherboards"("wifi_integrated");

-- CreateIndex
CREATE INDEX "motherboards_manufacturer_series_idx" ON "motherboards"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "motherboards_overclocking_support_idx" ON "motherboards"("overclocking_support");

-- CreateIndex
CREATE INDEX "motherboards_ecc_support_idx" ON "motherboards"("ecc_support");

-- CreateIndex
CREATE INDEX "motherboards_best_price_idx" ON "motherboards"("best_price");

-- CreateIndex
CREATE INDEX "motherboards_price_updated_at_idx" ON "motherboards"("price_updated_at");

-- CreateIndex
CREATE INDEX "motherboards_price_scraping_status_idx" ON "motherboards"("price_scraping_status");

-- CreateIndex
CREATE INDEX "motherboards_socket_form_factor_idx" ON "motherboards"("socket", "form_factor");

-- CreateIndex
CREATE INDEX "motherboards_memory_type_memory_slots_idx" ON "motherboards"("memory_type", "memory_slots");

-- CreateIndex
CREATE INDEX "motherboards_pcie_x16_slots_pcie_gen_idx" ON "motherboards"("pcie_x16_slots", "pcie_gen");

-- CreateIndex
CREATE UNIQUE INDEX "pc_cases_opendb_id_key" ON "pc_cases"("opendb_id");

-- CreateIndex
CREATE INDEX "pc_cases_form_factor_idx" ON "pc_cases"("form_factor");

-- CreateIndex
CREATE INDEX "pc_cases_supports_atx_idx" ON "pc_cases"("supports_atx");

-- CreateIndex
CREATE INDEX "pc_cases_supports_matx_idx" ON "pc_cases"("supports_matx");

-- CreateIndex
CREATE INDEX "pc_cases_supports_mitx_idx" ON "pc_cases"("supports_mitx");

-- CreateIndex
CREATE INDEX "pc_cases_max_gpu_length_idx" ON "pc_cases"("max_gpu_length");

-- CreateIndex
CREATE INDEX "pc_cases_max_cpu_cooler_height_idx" ON "pc_cases"("max_cpu_cooler_height");

-- CreateIndex
CREATE INDEX "pc_cases_expansion_slots_idx" ON "pc_cases"("expansion_slots");

-- CreateIndex
CREATE INDEX "pc_cases_drive_bays_3_5_idx" ON "pc_cases"("drive_bays_3_5");

-- CreateIndex
CREATE INDEX "pc_cases_drive_bays_2_5_idx" ON "pc_cases"("drive_bays_2_5");

-- CreateIndex
CREATE INDEX "pc_cases_psu_form_factors_idx" ON "pc_cases"("psu_form_factors");

-- CreateIndex
CREATE INDEX "pc_cases_has_tempered_glass_idx" ON "pc_cases"("has_tempered_glass");

-- CreateIndex
CREATE INDEX "pc_cases_manufacturer_series_idx" ON "pc_cases"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "pc_cases_color_idx" ON "pc_cases"("color");

-- CreateIndex
CREATE INDEX "pc_cases_volume_idx" ON "pc_cases"("volume");

-- CreateIndex
CREATE INDEX "pc_cases_radiator_support_240mm_idx" ON "pc_cases"("radiator_support_240mm");

-- CreateIndex
CREATE INDEX "pc_cases_radiator_support_360mm_idx" ON "pc_cases"("radiator_support_360mm");

-- CreateIndex
CREATE INDEX "pc_cases_best_price_idx" ON "pc_cases"("best_price");

-- CreateIndex
CREATE INDEX "pc_cases_price_updated_at_idx" ON "pc_cases"("price_updated_at");

-- CreateIndex
CREATE INDEX "pc_cases_price_scraping_status_idx" ON "pc_cases"("price_scraping_status");

-- CreateIndex
CREATE INDEX "pc_cases_form_factor_max_gpu_length_idx" ON "pc_cases"("form_factor", "max_gpu_length");

-- CreateIndex
CREATE INDEX "pc_cases_supports_atx_max_cpu_cooler_height_idx" ON "pc_cases"("supports_atx", "max_cpu_cooler_height");

-- CreateIndex
CREATE UNIQUE INDEX "psus_opendb_id_key" ON "psus"("opendb_id");

-- CreateIndex
CREATE INDEX "psus_wattage_idx" ON "psus"("wattage");

-- CreateIndex
CREATE INDEX "psus_form_factor_idx" ON "psus"("form_factor");

-- CreateIndex
CREATE INDEX "psus_length_idx" ON "psus"("length");

-- CreateIndex
CREATE INDEX "psus_connector_atx_24pin_idx" ON "psus"("connector_atx_24pin");

-- CreateIndex
CREATE INDEX "psus_connector_eps_8pin_idx" ON "psus"("connector_eps_8pin");

-- CreateIndex
CREATE INDEX "psus_connector_pcie_8pin_idx" ON "psus"("connector_pcie_8pin");

-- CreateIndex
CREATE INDEX "psus_connector_pcie_6plus2_idx" ON "psus"("connector_pcie_6plus2");

-- CreateIndex
CREATE INDEX "psus_connector_pcie_12vhpwr_idx" ON "psus"("connector_pcie_12vhpwr");

-- CreateIndex
CREATE INDEX "psus_connector_sata_idx" ON "psus"("connector_sata");

-- CreateIndex
CREATE INDEX "psus_efficiency_rating_idx" ON "psus"("efficiency_rating");

-- CreateIndex
CREATE INDEX "psus_modular_type_idx" ON "psus"("modular_type");

-- CreateIndex
CREATE INDEX "psus_fanless_idx" ON "psus"("fanless");

-- CreateIndex
CREATE INDEX "psus_manufacturer_series_idx" ON "psus"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "psus_best_price_idx" ON "psus"("best_price");

-- CreateIndex
CREATE INDEX "psus_price_updated_at_idx" ON "psus"("price_updated_at");

-- CreateIndex
CREATE INDEX "psus_price_scraping_status_idx" ON "psus"("price_scraping_status");

-- CreateIndex
CREATE INDEX "psus_wattage_form_factor_idx" ON "psus"("wattage", "form_factor");

-- CreateIndex
CREATE INDEX "psus_wattage_efficiency_rating_idx" ON "psus"("wattage", "efficiency_rating");

-- CreateIndex
CREATE INDEX "psus_connector_pcie_8pin_connector_pcie_6plus2_idx" ON "psus"("connector_pcie_8pin", "connector_pcie_6plus2");

-- CreateIndex
CREATE UNIQUE INDEX "ram_modules_opendb_id_key" ON "ram_modules"("opendb_id");

-- CreateIndex
CREATE INDEX "ram_modules_ram_type_idx" ON "ram_modules"("ram_type");

-- CreateIndex
CREATE INDEX "ram_modules_form_factor_idx" ON "ram_modules"("form_factor");

-- CreateIndex
CREATE INDEX "ram_modules_total_capacity_idx" ON "ram_modules"("total_capacity");

-- CreateIndex
CREATE INDEX "ram_modules_modules_quantity_idx" ON "ram_modules"("modules_quantity");

-- CreateIndex
CREATE INDEX "ram_modules_speed_mhz_idx" ON "ram_modules"("speed_mhz");

-- CreateIndex
CREATE INDEX "ram_modules_cas_latency_idx" ON "ram_modules"("cas_latency");

-- CreateIndex
CREATE INDEX "ram_modules_ecc_support_idx" ON "ram_modules"("ecc_support");

-- CreateIndex
CREATE INDEX "ram_modules_registered_idx" ON "ram_modules"("registered");

-- CreateIndex
CREATE INDEX "ram_modules_voltage_idx" ON "ram_modules"("voltage");

-- CreateIndex
CREATE INDEX "ram_modules_rgb_lighting_idx" ON "ram_modules"("rgb_lighting");

-- CreateIndex
CREATE INDEX "ram_modules_xmp_profile_idx" ON "ram_modules"("xmp_profile");

-- CreateIndex
CREATE INDEX "ram_modules_docp_profile_idx" ON "ram_modules"("docp_profile");

-- CreateIndex
CREATE INDEX "ram_modules_expo_profile_idx" ON "ram_modules"("expo_profile");

-- CreateIndex
CREATE INDEX "ram_modules_height_mm_idx" ON "ram_modules"("height_mm");

-- CreateIndex
CREATE INDEX "ram_modules_manufacturer_series_idx" ON "ram_modules"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "ram_modules_best_price_idx" ON "ram_modules"("best_price");

-- CreateIndex
CREATE INDEX "ram_modules_price_updated_at_idx" ON "ram_modules"("price_updated_at");

-- CreateIndex
CREATE INDEX "ram_modules_price_scraping_status_idx" ON "ram_modules"("price_scraping_status");

-- CreateIndex
CREATE INDEX "ram_modules_ram_type_speed_mhz_idx" ON "ram_modules"("ram_type", "speed_mhz");

-- CreateIndex
CREATE INDEX "ram_modules_total_capacity_modules_quantity_idx" ON "ram_modules"("total_capacity", "modules_quantity");

-- CreateIndex
CREATE INDEX "ram_modules_speed_mhz_cas_latency_idx" ON "ram_modules"("speed_mhz", "cas_latency");

-- CreateIndex
CREATE INDEX "ram_modules_ecc_support_registered_idx" ON "ram_modules"("ecc_support", "registered");

-- CreateIndex
CREATE UNIQUE INDEX "storage_opendb_id_key" ON "storage"("opendb_id");

-- CreateIndex
CREATE INDEX "storage_storage_type_idx" ON "storage"("storage_type");

-- CreateIndex
CREATE INDEX "storage_form_factor_idx" ON "storage"("form_factor");

-- CreateIndex
CREATE INDEX "storage_interface_type_idx" ON "storage"("interface_type");

-- CreateIndex
CREATE INDEX "storage_capacity_gb_idx" ON "storage"("capacity_gb");

-- CreateIndex
CREATE INDEX "storage_is_nvme_idx" ON "storage"("is_nvme");

-- CreateIndex
CREATE INDEX "storage_is_ssd_idx" ON "storage"("is_ssd");

-- CreateIndex
CREATE INDEX "storage_manufacturer_series_idx" ON "storage"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "storage_rpm_idx" ON "storage"("rpm");

-- CreateIndex
CREATE INDEX "storage_read_speed_mbps_idx" ON "storage"("read_speed_mbps");

-- CreateIndex
CREATE INDEX "storage_write_speed_mbps_idx" ON "storage"("write_speed_mbps");

-- CreateIndex
CREATE INDEX "storage_capacity_gb_storage_type_idx" ON "storage"("capacity_gb", "storage_type");

-- CreateIndex
CREATE INDEX "storage_best_price_idx" ON "storage"("best_price");

-- CreateIndex
CREATE INDEX "storage_price_updated_at_idx" ON "storage"("price_updated_at");

-- CreateIndex
CREATE INDEX "storage_price_scraping_status_idx" ON "storage"("price_scraping_status");
