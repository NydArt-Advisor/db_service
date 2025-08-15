const mongoose = require('mongoose');
const Plan = require('../models/Plan');
require('dotenv').config();

// Comprehensive plans data
const plans = [
  {
    name: 'Free',
    description: 'Free plan for all users - perfect for getting started',
    price: 0,
    stripePriceId: '',
    currency: 'eur',
    requests: 5,
    features: [
      '5 AI art analysis requests per month',
      'Basic support',
      'Standard response time',
      'Community access'
    ],
    isActive: true
  },
  {
    name: 'Basic',
    description: 'Basic plan with more requests and features',
    price: 19.99,
    stripePriceId: 'price_1RhiKUC1UCgZXnBPiyboASau',
    currency: 'eur',
    requests: 25,
    features: [
      '25 AI art analysis requests per month',
      'Priority support',
      'Faster response time',
      'Detailed analysis reports',
      'Export capabilities',
      'Email notifications'
    ],
    isActive: true
  },
  {
    name: 'Pro',
    description: 'Professional plan with unlimited requests and premium features',
    price: 49.99,
    stripePriceId: 'price_1RhiMzC1UCgZXnBPy0Avp9W1',
    currency: 'eur',
    requests: 100,
    features: [
      '100 AI art analysis requests per month',
      'Premium support',
      'Instant response time',
      'Advanced analysis reports',
      'Bulk export capabilities',
      'Priority email notifications',
      'API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    isActive: true
  }
];

async function seedPlans() {
    try {
        console.log('Starting plan seeding...');
        
        // Check if plans already exist
        const existingPlans = await Plan.find();
        console.log(`Found ${existingPlans.length} existing plans`);

        if (existingPlans.length > 0) {
            console.log('Plans already exist. Updating with latest data...');
        }

        // Insert or update each plan
        for (const planData of plans) {
            const result = await Plan.findOneAndUpdate(
                { name: planData.name },
                planData,
                { upsert: true, new: true, runValidators: true }
            );
            console.log(`✓ Plan "${result.name}" processed (${result.price}${result.currency})`);
        }

        // Display final results
        const finalPlans = await Plan.find().sort({ price: 1 });
        console.log('\n=== Final Plans in Database ===');
        finalPlans.forEach(plan => {
            console.log(`- ${plan.name}: ${plan.price}${plan.currency} (${plan.requests} requests)`);
        });

        console.log('\nPlan seeding completed successfully!');
    } catch (error) {
        console.error('Plan seeding failed:', error);
        throw error;
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            return seedPlans();
        })
        .then(() => {
            console.log('Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedPlans }; 