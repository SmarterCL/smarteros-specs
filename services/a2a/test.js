/**
 * SmarterOS v5 - A2A Stress Test
 * Test A2A communication under load
 */

const { A2AClient } = require('./client');
const axios = require('axios');

const A2A_ENDPOINT = 'http://localhost:3095';

// ═══════════════════════════════════════════════════════════
// STRESS TEST CONFIGURATION
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  numAgents: 10,
  messagesPerAgent: 50,
  concurrentMessages: 5,
  timeout: 30000 // 30 seconds
};

// ═══════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════

async function registerAgents(numAgents) {
  console.log(`\n📝 Registering ${numAgents} agents...`);

  const agents = [];

  for (let i = 1; i <= numAgents; i++) {
    const agent = new A2AClient({
      agentId: `test-agent-${i}`,
      agentName: `Test Agent ${i}`,
      capabilities: ['test', 'stress_test']
    });

    try {
      await agent.register(`http://localhost:${3000 + i}`);
      agents.push(agent);
      console.log(`✅ Agent ${i} registered`);
    } catch (error) {
      console.error(`❌ Agent ${i} failed:`, error.message);
    }
  }

  return agents;
}

async function sendMessageBurst(agent, receiverId, numMessages) {
  const startTime = Date.now();
  let success = 0;
  let failed = 0;

  const promises = [];

  for (let i = 0; i < numMessages; i++) {
    const promise = agent.sendMessage(
      receiverId,
      {
        test_id: i,
        timestamp: Date.now(),
        payload: `Stress test message ${i}`
      },
      `stress-test-${agent.agentId}`
    ).then(() => {
      success++;
    }).catch(() => {
      failed++;
    });

    promises.push(promise);

    // Limit concurrent messages
    if (promises.length >= CONFIG.concurrentMessages) {
      await Promise.all(promises);
      promises.length = 0;
    }
  }

  await Promise.all(promises);

  const duration = Date.now() - startTime;
  const messagesPerSecond = (success + failed) / (duration / 1000);

  return {
    agent: agent.agentId,
    total: numMessages,
    success,
    failed,
    duration,
    messagesPerSecond: messagesPerSecond.toFixed(2)
  };
}

async function runStressTest(agents) {
  console.log(`\n🚀 Starting stress test with ${agents.length} agents...`);
  console.log(`   Messages per agent: ${CONFIG.messagesPerAgent}`);
  console.log(`   Concurrent messages: ${CONFIG.concurrentMessages}`);
  console.log('');

  const results = [];

  for (const agent of agents) {
    // Pick random receiver
    const receivers = agents.filter(a => a.agentId !== agent.agentId);
    if (receivers.length === 0) continue;

    const receiver = receivers[Math.floor(Math.random() * receivers.length)];

    console.log(`📤 Agent ${agent.agentId} → ${receiver.agentId}`);

    const result = await sendMessageBurst(agent, receiver.agentId, CONFIG.messagesPerAgent);
    results.push(result);

    console.log(`   ✅ Success: ${result.success}/${result.total}`);
    console.log(`   ❌ Failed: ${result.failed}`);
    console.log(`   ⏱️  Duration: ${result.duration}ms`);
    console.log(`   📊 Throughput: ${result.messagesPerSecond} msg/s`);
    console.log('');
  }

  return results;
}

function printSummary(results) {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              STRESS TEST SUMMARY                         ║');
  console.log('╠══════════════════════════════════════════════════════════╣');

  const totalMessages = results.reduce((sum, r) => sum + r.total, 0);
  const totalSuccess = results.reduce((sum, r) => sum + r.success, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const avgThroughput = results.reduce((sum, r) => sum + parseFloat(r.messagesPerSecond), 0) / results.length;

  console.log(`║  Total Messages:  ${totalMessages}`);
  console.log(`║  Success:         ${totalSuccess} (${(totalSuccess / totalMessages * 100).toFixed(2)}%)`);
  console.log(`║  Failed:          ${totalFailed} (${(totalFailed / totalMessages * 100).toFixed(2)}%)`);
  console.log(`║  Avg Duration:    ${avgDuration.toFixed(2)}ms`);
  console.log(`║  Avg Throughput:  ${avgThroughput.toFixed(2)} msg/s`);
  console.log('╚══════════════════════════════════════════════════════════╝');
}

async function cleanup(agents) {
  console.log('\n🧹 Cleaning up...');

  for (const agent of agents) {
    try {
      await agent.unregister();
    } catch (error) {
      console.error(`Failed to unregister ${agent.agentId}:`, error.message);
    }
  }

  console.log('✅ Cleanup complete');
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   🧪 SmarterOS v5 - A2A Stress Test                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Configuration:`);
  console.log(`  Agents: ${CONFIG.numAgents}`);
  console.log(`  Messages/Agent: ${CONFIG.messagesPerAgent}`);
  console.log(`  Concurrent: ${CONFIG.concurrentMessages}`);
  console.log(`  Timeout: ${CONFIG.timeout}ms`);

  // Check if server is running
  try {
    const health = await axios.get(`${A2A_ENDPOINT}/health`);
    console.log('\n✅ A2A Server is running');
    console.log(`   Status: ${health.data.status}`);
    console.log(`   Version: ${health.data.version}`);
  } catch (error) {
    console.error('\n❌ A2A Server is not running');
    console.error('   Start server with: node server.js');
    process.exit(1);
  }

  const startTime = Date.now();

  try {
    // Register agents
    const agents = await registerAgents(CONFIG.numAgents);

    if (agents.length === 0) {
      console.error('❌ No agents registered. Exiting.');
      process.exit(1);
    }

    // Run stress test
    const results = await runStressTest(agents);

    // Print summary
    printSummary(results);

    // Cleanup
    await cleanup(agents);

    const totalDuration = Date.now() - startTime;
    console.log(`\n⏱️  Total test duration: ${totalDuration}ms`);
    console.log('\n✅ Stress test completed');

  } catch (error) {
    console.error('\n❌ Stress test failed:', error.message);
    process.exit(1);
  }
}

// Run main
main();
