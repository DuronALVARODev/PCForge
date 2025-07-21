-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpus" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "socket" TEXT,
    "microarchitecture" TEXT,
    "core_family" TEXT,
    "cores_total" INTEGER,
    "cores_performance" INTEGER,
    "cores_efficiency" INTEGER,
    "cores_threads" INTEGER,
    "clock_base" DOUBLE PRECISION,
    "clock_boost" DOUBLE PRECISION,
    "clock_eff_base" DOUBLE PRECISION,
    "clock_eff_boost" DOUBLE PRECISION,
    "cache_l1" TEXT,
    "cache_l2" INTEGER,
    "cache_l3" INTEGER,
    "tdp" INTEGER,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "integrated_graphics" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cpus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpus" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "chipset_manufacturer" TEXT,
    "chipset" TEXT,
    "interface" TEXT,
    "length" INTEGER,
    "case_expansion_slot_width" INTEGER,
    "total_slot_width" INTEGER,
    "tdp" INTEGER,
    "power_6_pin" INTEGER,
    "power_8_pin" INTEGER,
    "power_12vhpwr" INTEGER,
    "power_12v_2x6" INTEGER,
    "memory" INTEGER,
    "memory_type" TEXT,
    "memory_bus" INTEGER,
    "effective_memory_clock" INTEGER,
    "core_count" INTEGER,
    "core_base_clock" INTEGER,
    "core_boost_clock" INTEGER,
    "cooling" TEXT,
    "color" TEXT[],
    "frame_sync" TEXT,
    "hdmi_2_1" INTEGER,
    "hdmi_2_0" INTEGER,
    "best_price" DOUBLE PRECISION,
    "best_price_url" TEXT,
    "best_price_store" TEXT,
    "price_updated_at" TIMESTAMP(3),
    "all_prices" JSONB,
    "price_scraping_status" TEXT,
    "video_outputs" JSONB,
    "power_connectors" JSONB,
    "retailer_skus" JSONB,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gpus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "cpus_opendb_id_key" ON "cpus"("opendb_id");

-- CreateIndex
CREATE INDEX "cpus_socket_idx" ON "cpus"("socket");

-- CreateIndex
CREATE INDEX "cpus_cores_threads_idx" ON "cpus"("cores_threads");

-- CreateIndex
CREATE INDEX "cpus_clock_boost_idx" ON "cpus"("clock_boost");

-- CreateIndex
CREATE INDEX "cpus_tdp_idx" ON "cpus"("tdp");

-- CreateIndex
CREATE INDEX "cpus_manufacturer_series_idx" ON "cpus"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "cpus_microarchitecture_idx" ON "cpus"("microarchitecture");

-- CreateIndex
CREATE INDEX "cpus_cores_total_cores_threads_idx" ON "cpus"("cores_total", "cores_threads");

-- CreateIndex
CREATE INDEX "cpus_best_price_idx" ON "cpus"("best_price");

-- CreateIndex
CREATE INDEX "cpus_price_updated_at_idx" ON "cpus"("price_updated_at");

-- CreateIndex
CREATE INDEX "cpus_price_scraping_status_idx" ON "cpus"("price_scraping_status");

-- CreateIndex
CREATE UNIQUE INDEX "gpus_opendb_id_key" ON "gpus"("opendb_id");

-- CreateIndex
CREATE INDEX "gpus_chipset_manufacturer_idx" ON "gpus"("chipset_manufacturer");

-- CreateIndex
CREATE INDEX "gpus_chipset_idx" ON "gpus"("chipset");

-- CreateIndex
CREATE INDEX "gpus_interface_idx" ON "gpus"("interface");

-- CreateIndex
CREATE INDEX "gpus_length_idx" ON "gpus"("length");

-- CreateIndex
CREATE INDEX "gpus_case_expansion_slot_width_idx" ON "gpus"("case_expansion_slot_width");

-- CreateIndex
CREATE INDEX "gpus_tdp_idx" ON "gpus"("tdp");

-- CreateIndex
CREATE INDEX "gpus_power_8_pin_power_6_pin_idx" ON "gpus"("power_8_pin", "power_6_pin");

-- CreateIndex
CREATE INDEX "gpus_power_12vhpwr_power_12v_2x6_idx" ON "gpus"("power_12vhpwr", "power_12v_2x6");

-- CreateIndex
CREATE INDEX "gpus_memory_idx" ON "gpus"("memory");

-- CreateIndex
CREATE INDEX "gpus_memory_type_idx" ON "gpus"("memory_type");

-- CreateIndex
CREATE INDEX "gpus_core_boost_clock_idx" ON "gpus"("core_boost_clock");

-- CreateIndex
CREATE INDEX "gpus_manufacturer_series_idx" ON "gpus"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "gpus_best_price_idx" ON "gpus"("best_price");

-- CreateIndex
CREATE INDEX "gpus_price_updated_at_idx" ON "gpus"("price_updated_at");

-- CreateIndex
CREATE INDEX "gpus_price_scraping_status_idx" ON "gpus"("price_scraping_status");

-- CreateIndex
CREATE INDEX "gpus_cooling_idx" ON "gpus"("cooling");

-- CreateIndex
CREATE INDEX "gpus_frame_sync_idx" ON "gpus"("frame_sync");
