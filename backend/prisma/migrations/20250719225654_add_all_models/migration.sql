-- CreateTable
CREATE TABLE "cpu_coolers" (
    "id" TEXT NOT NULL,
    "opendb_id" TEXT,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "series" TEXT,
    "part_numbers" TEXT[],
    "variant" TEXT,
    "release_year" INTEGER,
    "cpu_sockets" TEXT[],
    "height" INTEGER,
    "fan_size" INTEGER,
    "water_cooled" BOOLEAN,
    "fanless" BOOLEAN,
    "radiator_size" INTEGER,
    "fan_quantity" INTEGER,
    "min_fan_rpm" INTEGER,
    "max_fan_rpm" INTEGER,
    "min_noise_level" DOUBLE PRECISION,
    "max_noise_level" DOUBLE PRECISION,
    "color" TEXT[],
    "max_tdp_support" INTEGER,
    "rgb_lighting" BOOLEAN,
    "pwm_control" BOOLEAN,
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

    CONSTRAINT "cpu_coolers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cpu_coolers_opendb_id_key" ON "cpu_coolers"("opendb_id");

-- CreateIndex
CREATE INDEX "cpu_coolers_cpu_sockets_idx" ON "cpu_coolers"("cpu_sockets");

-- CreateIndex
CREATE INDEX "cpu_coolers_height_idx" ON "cpu_coolers"("height");

-- CreateIndex
CREATE INDEX "cpu_coolers_water_cooled_idx" ON "cpu_coolers"("water_cooled");

-- CreateIndex
CREATE INDEX "cpu_coolers_radiator_size_idx" ON "cpu_coolers"("radiator_size");

-- CreateIndex
CREATE INDEX "cpu_coolers_fan_size_idx" ON "cpu_coolers"("fan_size");

-- CreateIndex
CREATE INDEX "cpu_coolers_max_tdp_support_idx" ON "cpu_coolers"("max_tdp_support");

-- CreateIndex
CREATE INDEX "cpu_coolers_max_noise_level_idx" ON "cpu_coolers"("max_noise_level");

-- CreateIndex
CREATE INDEX "cpu_coolers_manufacturer_series_idx" ON "cpu_coolers"("manufacturer", "series");

-- CreateIndex
CREATE INDEX "cpu_coolers_fanless_idx" ON "cpu_coolers"("fanless");

-- CreateIndex
CREATE INDEX "cpu_coolers_rgb_lighting_idx" ON "cpu_coolers"("rgb_lighting");

-- CreateIndex
CREATE INDEX "cpu_coolers_color_idx" ON "cpu_coolers"("color");

-- CreateIndex
CREATE INDEX "cpu_coolers_best_price_idx" ON "cpu_coolers"("best_price");

-- CreateIndex
CREATE INDEX "cpu_coolers_price_updated_at_idx" ON "cpu_coolers"("price_updated_at");

-- CreateIndex
CREATE INDEX "cpu_coolers_price_scraping_status_idx" ON "cpu_coolers"("price_scraping_status");

-- CreateIndex
CREATE INDEX "cpu_coolers_water_cooled_radiator_size_idx" ON "cpu_coolers"("water_cooled", "radiator_size");

-- CreateIndex
CREATE INDEX "cpu_coolers_height_fan_size_idx" ON "cpu_coolers"("height", "fan_size");
