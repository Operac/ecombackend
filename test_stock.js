const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 STARTING STOCK LOGIC TEST...");

  // 1. Get a category to use
  console.log("1. Finding a valid Category...");
  const category = await prisma.category.findFirst();
  
  if (!category) {
    console.error("❌ No categories found. Cannot create product. Please create a category first.");
    return;
  }
  console.log(`✅ Using Category: ${category.name} (ID: ${category.id})`);

  // 2. Create Product with Quantity
  console.log("\n2. Creating Test Product with Quantity: 50...");
  const product = await prisma.product.create({
    data: {
      name: `TEST_STOCK_ITEM_${Date.now()}`,
      description: "Test description",
      price: 5000,
      currency: "NGN",
      defaultSize: "M",
      defaultColor: "Red",
      sizes: ["M"],
      colors: ["Red"],
      bestSelling: false,
      subcategory: "Test",
      rating: 5,
      discount: 0,
      oldPrice: 0,
      tags: ["test"],
      newArrival: false,
      categoryid: category.id,
      image: "https://via.placeholder.com/150",
      quantity: 50 // THE NEW FIELD
    }
  });

  console.log(`✅ Product Created! ID: ${product.id}`);
  console.log(`   Quantity from DB: ${product.quantity}`);

  if (product.quantity === 50) {
      console.log("   --> PASSED: Quantity was saved correctly.");
  } else {
      console.error("   --> FAILED: Quantity mismatch.");
  }

  // 3. Simulate Purchase (Decrement)
  console.log("\n3. Simulating 'Purchase' of 3 items (Decrement Logic)...");
  const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
          quantity: {
              decrement: 3
          }
      }
  });

  console.log(`✅ Update Complete.`);
  console.log(`   New Quantity: ${updatedProduct.quantity}`);

  if (updatedProduct.quantity === 47) {
      console.log("   --> PASSED: Stock decremented correctly (50 - 3 = 47).");
  } else {
      console.error("   --> FAILED: Decrement logic incorrect.");
  }

  // 4. Cleanup
  console.log("\n4. Cleaning up test data...");
  await prisma.product.delete({
      where: { id: product.id }
  });
  console.log("✅ Test Product Deleted.");
  
  console.log("\n🎉 TEST COMPLETED SUCCESSFULLY!");
}

main()
  .catch(e => {
    console.error("\n❌ TEST FAILED WITH ERROR:");
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
