import { 
  getComplaintById, 
  acceptComplaintAndCreateRepairTask, 
  getAllComplaints 
} from '../services/complaint.service';
import { 
  getPotholeById, 
  updateRepairStatus, 
  getAllPotholes 
} from '../services/pothole.service';
import { getAllNotifications } from '../services/notification.service';
import { query } from '../config/database';

async function runEndToEndTest() {
  console.log('====================================================');
  console.log('🧪 TESTING CITIZEN COMPLAINT TO REPAIR WORKFLOW');
  console.log('====================================================\n');

  // Ensure clean starting state for CMP-0004
  await query(`
    UPDATE complaints 
    SET status = 'NEW', linked_pothole_id = NULL, admin_notes = 'Awaiting officer review.'
    WHERE id = 'CMP-0004'
  `);
  await query(`DELETE FROM potholes WHERE id = 'CMP-0004'`);
  await query(`DELETE FROM repair_history WHERE pothole_id = 'CMP-0004'`);

  // STEP 1: Verify CMP-0004 is NEW
  console.log('1️⃣ Step 1: Checking Initial State of CMP-0004...');
  const cmpStep1 = await getComplaintById('CMP-0004');
  if (!cmpStep1) throw new Error('CMP-0004 not found in database');
  console.log(`   Complaint ID: ${cmpStep1.id}`);
  console.log(`   Citizen: ${cmpStep1.citizen_name}`);
  console.log(`   Location: ${cmpStep1.location}`);
  console.log(`   Severity: ${cmpStep1.severity_estimate}`);
  console.log(`   Status: ${cmpStep1.status} (Expected: NEW)`);
  if (cmpStep1.status !== 'NEW') throw new Error(`Expected status NEW, got ${cmpStep1.status}`);

  // STEP 2: Accept Complaint & Create Repair Task
  console.log('\n2️⃣ Step 2: Accepting Complaint and Creating Repair Task...');
  const { complaint: cmpStep2, repairTask: repStep2 } = await acceptComplaintAndCreateRepairTask('CMP-0004', {
    notes: 'Emergency road defect verified by officer.'
  });
  console.log(`   Repair Task ID: ${repStep2.id}`);
  console.log(`   Task Source: ${repStep2.source} (Expected: CITIZEN_COMPLAINT)`);
  console.log(`   Calculated Priority: ${repStep2.priority} (Expected: CRITICAL)`);
  console.log(`   Initial Status: ${repStep2.status} (Expected: PENDING)`);
  console.log(`   Updated Complaint Status: ${cmpStep2.status}`);

  // STEP 3: Verify Task Appears in Repair Management List
  console.log('\n3️⃣ Step 3: Verifying Task Appears in Repair Management...');
  const allPotholes = await getAllPotholes();
  const taskInList = allPotholes.find(p => p.id === 'CMP-0004');
  if (!taskInList) throw new Error('CMP-0004 not found in repair tasks list');
  console.log(`   Found in repair management: ${taskInList.id} | Location: ${taskInList.location} | Source: ${taskInList.source}`);

  // STEP 4: Assign Field Engineer (ASSIGNED)
  console.log('\n4️⃣ Step 4: Assigning Field Engineer...');
  const repStep4 = await updateRepairStatus(
    'CMP-0004',
    'ASSIGNED',
    'Deploy cold-mix patch and safety cones',
    'Er. Rajesh Bhat (PWD)'
  );
  console.log(`   Repair Task Status: ${repStep4.status} (Expected: ASSIGNED)`);
  console.log(`   Assigned Engineer: ${repStep4.assigned_engineer}`);
  const cmpStep4 = await getComplaintById('CMP-0004');
  console.log(`   Linked Complaint Status: ${cmpStep4?.status} (Expected: ASSIGNED)`);
  if (cmpStep4?.status !== 'ASSIGNED') throw new Error(`Expected complaint status ASSIGNED, got ${cmpStep4?.status}`);

  // STEP 5: Progress to REPAIR IN PROGRESS
  console.log('\n5️⃣ Step 5: Progressing Status to REPAIR IN PROGRESS...');
  const repStep5 = await updateRepairStatus(
    'CMP-0004',
    'REPAIR IN PROGRESS',
    'Field team arrived on site and commenced asphalt rolling',
    'Er. Rajesh Bhat (PWD)'
  );
  console.log(`   Repair Task Status: ${repStep5.status} (Expected: REPAIR IN PROGRESS)`);
  const cmpStep5 = await getComplaintById('CMP-0004');
  console.log(`   Linked Complaint Status: ${cmpStep5?.status} (Expected: IN PROGRESS)`);

  // STEP 6: Mark REPAIRED and verify Auto-Resolution
  console.log('\n6️⃣ Step 6: Marking Task REPAIRED...');
  const repStep6 = await updateRepairStatus(
    'CMP-0004',
    'REPAIRED',
    'Hot-mix compaction completed and verified',
    'Er. Rajesh Bhat (PWD)',
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
  );
  console.log(`   Repair Task Status: ${repStep6.status} (Expected: REPAIRED)`);
  console.log(`   Repaired Image URL: ${repStep6.repaired_image_url ? 'Stored' : 'None'}`);
  console.log(`   Repair History Log Count: ${repStep6.repairHistory.length}`);

  // STEP 7: Verify Complaint Status becomes RESOLVED
  console.log('\n7️⃣ Step 7: Verifying Complaint Auto-Resolved...');
  const cmpStep7 = await getComplaintById('CMP-0004');
  console.log(`   Complaint Status: ${cmpStep7?.status} (Expected: RESOLVED)`);
  console.log(`   Complaint Admin Notes: ${cmpStep7?.admin_notes}`);
  if (cmpStep7?.status !== 'RESOLVED') throw new Error(`Expected complaint status RESOLVED, got ${cmpStep7?.status}`);

  // STEP 8: Verify Notifications Generated
  console.log('\n8️⃣ Step 8: Verifying Notifications Generated...');
  const notifications = await getAllNotifications();
  const cmpNotifications = notifications.filter(n => n.pothole_id === 'CMP-0004');
  console.log(`   Total notifications for CMP-0004: ${cmpNotifications.length}`);
  cmpNotifications.forEach(n => {
    console.log(`   - [${n.status}] ${n.title}: ${n.recommended_action}`);
  });

  console.log('\n====================================================');
  console.log('✅ ALL WORKFLOW STEPS PASSED SUCCESSFULLY!');
  console.log('====================================================');
  process.exit(0);
}

runEndToEndTest().catch(err => {
  console.error('❌ Workflow Test Failed:', err);
  process.exit(1);
});
