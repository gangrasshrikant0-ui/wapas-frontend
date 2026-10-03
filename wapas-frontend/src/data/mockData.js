// Sample data used only when VITE_USE_MOCK_API=true. Nothing here is imported by UI components.

const ts = (md, hm) => `2026-${md}T${hm}:00+05:30`;

const act = (caseId, rows) =>
  rows.map((r, i) => ({
    id: `${caseId}-a${i + 1}`,
    caseId,
    at: r[0],
    actor: r[1],
    title: r[2],
    description: r[3],
    status: r[4] || 'done',
  }));

export const seedCases = [
  { id: 'WP-24018', title: 'Lenovo LOQ Return', type: 'Product Refund', counterparty: 'Authorised retailer', reference: 'Order ending 44071', amount: 82490, status: 'awaiting_verification', createdAt: ts('09-12', '10:30'), updatedAt: ts('10-02', '16:45'), nextAction: 'Verify extracted claim details' },
  { id: 'WP-24021', title: 'Health Insurance Claim', type: 'Insurance', counterparty: 'Health insurer', reference: 'Claim HC-77310', amount: 36500, status: 'processing', createdAt: ts('09-18', '09:10'), updatedAt: ts('10-02', '11:20'), nextAction: 'Awaiting insurer decision' },
  { id: 'WP-24007', title: 'Corporate Travel Reimbursement', type: 'Reimbursement', counterparty: 'Employer finance team', reference: 'Expense report ER-2291', amount: 12850, status: 'completed', createdAt: ts('08-29', '14:05'), updatedAt: ts('09-24', '10:15'), nextAction: 'None' },
  { id: 'WP-24025', title: 'Bus Ticket Refund', type: 'Travel Refund', counterparty: 'Bus operator', reference: 'Ticket ending 5532', amount: 1450, status: 'action_required', createdAt: ts('09-27', '08:40'), updatedAt: ts('10-01', '18:05'), nextAction: 'Upload cancellation confirmation' },
  { id: 'WP-24029', title: 'Electricity Deposit Refund', type: 'Utility', counterparty: 'Electricity provider', reference: 'Deposit DR-55208', amount: 8000, status: 'action_required', createdAt: ts('09-30', '12:10'), updatedAt: ts('10-02', '12:00'), nextAction: 'Visit provider office with original receipt' },
  { id: 'WP-24014', title: 'Flight Cancellation Refund', type: 'Travel Refund', counterparty: 'Airline', reference: 'Booking ending 7Q2K', amount: 9640, status: 'processing', createdAt: ts('09-05', '17:25'), updatedAt: ts('10-01', '13:30'), nextAction: 'Awaiting airline response' },
  { id: 'WP-24031', title: 'Credit Card Fee Reversal', type: 'Bank Charge', counterparty: 'Card issuer', reference: 'Statement of Sep 2026', amount: 2360, status: 'new', createdAt: ts('10-02', '20:10'), updatedAt: ts('10-02', '20:10'), nextAction: 'Initial review queued' },
  { id: 'WP-23996', title: 'Gym Membership Refund', type: 'Subscription', counterparty: 'Fitness club', reference: 'Membership MB-1180', amount: 14200, status: 'unrecoverable', createdAt: ts('08-14', '11:00'), updatedAt: ts('09-20', '15:30'), nextAction: 'None, case closed' },
];

let docSeq = 1000;
const doc = (caseId, name, type, size, status, uploadedAt, uploadedBy = 'You') => ({
  id: `doc-${++docSeq}`,
  caseId,
  name,
  type,
  size,
  status,
  uploadedAt,
  uploadedBy,
});

export const seedDocuments = [
  doc('WP-24018', 'Invoice.pdf', 'Invoice', 218400, 'processed', ts('09-12', '10:34')),
  doc('WP-24018', 'Return_Request.pdf', 'Request', 96200, 'processed', ts('09-12', '10:34')),
  doc('WP-24018', 'Delivery_Receipt.pdf', 'Receipt', 143900, 'processed', ts('09-12', '10:35')),
  doc('WP-24018', 'Email_Conversation.pdf', 'Correspondence', 412700, 'requires_review', ts('09-29', '11:02'), 'System'),
  doc('WP-24021', 'Hospital_Bill.pdf', 'Invoice', 534800, 'processed', ts('09-18', '09:18')),
  doc('WP-24021', 'Discharge_Summary.pdf', 'Medical record', 287300, 'processed', ts('09-18', '09:18')),
  doc('WP-24021', 'Claim_Form.pdf', 'Claim form', 158000, 'processed', ts('09-18', '09:19')),
  doc('WP-24021', 'Policy_Schedule.pdf', 'Contract', 322500, 'processing', ts('10-02', '11:18'), 'System'),
  doc('WP-24007', 'Expense_Report.pdf', 'Claim form', 121700, 'processed', ts('08-29', '14:10')),
  doc('WP-24007', 'Hotel_Invoice.pdf', 'Invoice', 188200, 'processed', ts('08-29', '14:11')),
  doc('WP-24007', 'Boarding_Pass.png', 'Receipt', 642100, 'processed', ts('08-29', '14:12')),
  doc('WP-24025', 'Ticket_Screenshot.png', 'Receipt', 905400, 'processed', ts('09-27', '08:44')),
  doc('WP-24025', 'Cancellation_Email.txt', 'Correspondence', 2900, 'failed', ts('10-01', '17:50')),
  doc('WP-24029', 'Deposit_Receipt.jpg', 'Receipt', 1284000, 'processed', ts('09-30', '12:15')),
  doc('WP-24014', 'E_Ticket.pdf', 'Receipt', 176300, 'processed', ts('09-05', '17:30')),
  doc('WP-24014', 'Cancellation_Notice.pdf', 'Correspondence', 88400, 'processed', ts('09-05', '17:31')),
  doc('WP-24031', 'Card_Statement.pdf', 'Other', 261000, 'processing', ts('10-02', '20:12')),
  doc('WP-23996', 'Membership_Agreement.pdf', 'Contract', 354600, 'processed', ts('08-14', '11:05')),
  doc('WP-23996', 'Cancellation_Request.pdf', 'Request', 72300, 'processed', ts('08-14', '11:06')),
];

export const seedActivities = {
  'WP-24018': act('WP-24018', [
    [ts('09-12', '10:30'), 'user', 'Case created', 'Case opened for the refund on the returned Lenovo LOQ laptop.'],
    [ts('09-12', '10:34'), 'user', 'Documents uploaded', 'Invoice.pdf, Return_Request.pdf and Delivery_Receipt.pdf were added.'],
    [ts('09-12', '10:41'), 'system', 'Documents processed', 'Order, payment and return details were read from 3 documents.'],
    [ts('09-12', '10:42'), 'system', 'Claim details extracted', 'Order value ₹82,490. Return request accepted on 12 Sep.'],
    [ts('09-16', '18:20'), 'user', 'Call recording uploaded', 'Retailer_Support_Call_16Sep.mp3 was added.'],
    [ts('09-16', '18:23'), 'system', 'Transcript generated', 'Support call transcribed. Refund approval and pending credit were mentioned.'],
    [ts('09-29', '11:05'), 'system', 'External system queried', 'Retailer refund status checked. Refund is marked approved but not credited.'],
    [ts('10-01', '09:40'), 'system', 'Refund eligibility identified', 'Refund of ₹82,490 is eligible. Credit is overdue against the stated timeline.'],
    [ts('10-02', '16:45'), 'system', 'Awaiting user verification', 'A refund escalation request has been prepared and needs your confirmation.', 'current'],
    [null, 'system', 'Submit escalation request', 'Will be sent to the retailer after you confirm.', 'pending'],
  ]),
  'WP-24021': act('WP-24021', [
    [ts('09-18', '09:10'), 'user', 'Case created', 'Claim opened for hospital expenses from the September admission.'],
    [ts('09-18', '09:18'), 'user', 'Documents uploaded', 'Hospital_Bill.pdf, Discharge_Summary.pdf and Claim_Form.pdf were added.'],
    [ts('09-18', '09:30'), 'system', 'Documents processed', 'Billing items and policy number identified.'],
    [ts('09-18', '09:31'), 'system', 'Claim details extracted', 'Claimed amount ₹36,500 for admission from 6 to 8 Sep.'],
    [ts('09-19', '10:15'), 'system', 'Claim packet prepared', 'Claim form and supporting documents were assembled for submission.'],
    [ts('09-19', '10:40'), 'user', 'Information verified', 'You confirmed the claim details.'],
    [ts('09-19', '11:02'), 'system', 'Claim submitted', 'Claim submitted through the insurer portal. Acknowledgement received.'],
    [ts('10-02', '11:20'), 'system', 'Awaiting insurer decision', 'Status checked: under review. No further documents requested.', 'current'],
  ]),
  'WP-24007': act('WP-24007', [
    [ts('08-29', '14:05'), 'user', 'Case created', 'Reimbursement opened for a business trip in August.'],
    [ts('08-29', '14:12'), 'user', 'Documents uploaded', 'Expense_Report.pdf, Hotel_Invoice.pdf and Boarding_Pass.png were added.'],
    [ts('08-29', '14:20'), 'system', 'Documents processed', 'Three expense documents were read.'],
    [ts('08-29', '14:21'), 'system', 'Claim details extracted', 'Expense total ₹12,850 across 3 items.'],
    [ts('09-03', '10:00'), 'user', 'Information verified', 'You confirmed the expense totals.'],
    [ts('09-03', '10:05'), 'system', 'Request submitted', 'Reimbursement request sent to the finance team.'],
    [ts('09-17', '16:30'), 'system', 'Approval received', 'Finance approved the full amount.'],
    [ts('09-24', '10:15'), 'system', 'Payout status updated', 'Payment of ₹12,850 confirmed as credited. Case completed.'],
  ]),
  'WP-24025': act('WP-24025', [
    [ts('09-27', '08:40'), 'user', 'Case created', 'Refund requested for a cancelled bus journey.'],
    [ts('09-27', '08:44'), 'user', 'Document uploaded', 'Ticket_Screenshot.png was added.'],
    [ts('09-27', '08:49'), 'system', 'Claim details extracted', 'Fare ₹1,450. Journey cancelled before departure.'],
    [ts('09-28', '12:10'), 'system', 'Operator policy checked', 'A full refund is possible with a cancellation confirmation.'],
    [ts('10-01', '17:50'), 'user', 'Document uploaded', 'Cancellation_Email.txt was added.'],
    [ts('10-01', '18:05'), 'system', 'Document could not be read', 'Cancellation_Email.txt failed processing. A clearer copy is needed.', 'failed'],
  ]),
  'WP-24029': act('WP-24029', [
    [ts('09-30', '12:10'), 'user', 'Case created', 'Refund requested for a security deposit after closing the connection.'],
    [ts('09-30', '12:15'), 'user', 'Document uploaded', 'Deposit_Receipt.jpg was added.'],
    [ts('09-30', '12:22'), 'system', 'Claim details extracted', 'Security deposit of ₹8,000, reference DR-55208.'],
    [ts('10-01', '10:30'), 'system', 'Provider requirements checked', 'Refund requires in-person verification of the original receipt.'],
    [ts('10-02', '12:00'), 'system', 'Awaiting in-person step', 'This step must be completed by you at the provider office.', 'current'],
  ]),
  'WP-24014': act('WP-24014', [
    [ts('09-05', '17:25'), 'user', 'Case created', 'Refund requested after the airline cancelled the flight.'],
    [ts('09-05', '17:31'), 'user', 'Documents uploaded', 'E_Ticket.pdf and Cancellation_Notice.pdf were added.'],
    [ts('09-05', '17:40'), 'system', 'Claim details extracted', 'Refund due ₹9,640 following airline cancellation.'],
    [ts('09-06', '09:15'), 'system', 'External system queried', 'Refund request located on the airline portal. Status: under review.'],
    [ts('09-08', '11:00'), 'user', 'Information verified', 'You confirmed the booking and refund amount.'],
    [ts('09-08', '11:10'), 'system', 'Refund request submitted', 'Request submitted through the airline portal.'],
    [ts('10-01', '13:30'), 'system', 'Awaiting airline response', 'Portal status unchanged since 24 Sep.', 'current'],
  ]),
  'WP-24031': act('WP-24031', [
    [ts('10-02', '20:10'), 'user', 'Case created', 'Reversal requested for an annual fee charged in September.'],
    [ts('10-02', '20:12'), 'user', 'Document uploaded', 'Card_Statement.pdf was added.'],
    [ts('10-02', '20:13'), 'system', 'Initial review queued', 'Documents are waiting to be processed.', 'current'],
  ]),
  'WP-23996': act('WP-23996', [
    [ts('08-14', '11:00'), 'user', 'Case created', 'Refund requested for the unused part of a membership term.'],
    [ts('08-14', '11:06'), 'user', 'Documents uploaded', 'Membership_Agreement.pdf and Cancellation_Request.pdf were added.'],
    [ts('08-14', '11:15'), 'system', 'Claim details extracted', 'Refund of ₹14,200 requested for the unused term.'],
    [ts('08-22', '14:00'), 'system', 'Provider contacted', 'Provider declined. The agreement excludes refunds after activation.'],
    [ts('09-12', '10:20'), 'system', 'Escalation options reviewed', 'The grievance route needs evidence that is not in the submitted documents.'],
    [ts('09-20', '15:30'), 'system', 'Case closed', 'No recovery paths remain. Case marked unrecoverable.', 'closed'],
  ]),
};

export const seedAgentStates = {
  'WP-24018': {
    status: 'awaiting_user_action',
    message: 'The return has been verified. The next step requires your confirmation.',
    requiredAction: 'user_confirmation',
    details: [
      { label: 'Order value', value: '₹82,490' },
      { label: 'Return received by retailer', value: '16 Sep 2026' },
      { label: 'Refund approved by retailer', value: '19 Sep 2026' },
      { label: 'Credit to your account', value: 'Not received' },
      { label: 'Request prepared', value: 'Refund escalation to retailer support' },
    ],
    updatedAt: ts('10-02', '16:45'),
  },
  'WP-24021': { status: 'processing', message: 'The claim has been submitted to the insurer. A decision is awaited.', requiredAction: null, updatedAt: ts('10-02', '11:20') },
  'WP-24007': { status: 'completed', message: 'The reimbursement has been paid out. No further action is needed.', requiredAction: null, updatedAt: ts('09-24', '10:15') },
  'WP-24025': { status: 'awaiting_user_action', message: 'A readable cancellation confirmation is needed to continue. The last file could not be processed.', requiredAction: 'upload_document', updatedAt: ts('10-01', '18:05') },
  'WP-24029': {
    status: 'awaiting_user_action',
    message: 'The provider needs the original deposit receipt presented at its office. This step must be done in person.',
    requiredAction: 'physical_action',
    details: [
      { label: 'Where', value: 'Provider customer care office' },
      { label: 'Bring', value: 'Original deposit receipt and a photo ID' },
      { label: 'Deposit reference', value: 'DR-55208' },
    ],
    updatedAt: ts('10-02', '12:00'),
  },
  'WP-24014': { status: 'processing', message: 'The refund request is with the airline. The portal shows it as under review.', requiredAction: null, updatedAt: ts('10-01', '13:30') },
  'WP-24031': { status: 'processing', message: 'Documents were received. Initial review is queued.', requiredAction: null, updatedAt: ts('10-02', '20:13') },
  'WP-23996': { status: 'unrecoverable', message: 'The available recovery paths have been exhausted.', requiredAction: null, updatedAt: ts('09-20', '15:30') },
};

export const sampleTranscript = {
  duration: 45,
  segments: [
    { start: 0, end: 4.2, text: 'Hello, thank you for calling customer support. How can I help you today?' },
    { start: 4.2, end: 11.8, text: "Hi, I'm calling about a refund for a laptop I returned on the twelfth of September. The return was accepted, but the refund hasn't been credited yet." },
    { start: 11.8, end: 17.5, text: 'I can see the return was received at our warehouse on the sixteenth. Could you confirm the order number for me?' },
    { start: 17.5, end: 23.1, text: "Yes, it's the one ending in four four zero seven one." },
    { start: 23.1, end: 31.0, text: 'Thank you. The refund was approved on the nineteenth and is processing to the original payment method. It should take five to seven business days.' },
    { start: 31.0, end: 38.4, text: "It's been more than that already. Can you send me something in writing confirming the refund amount and date?" },
    { start: 38.4, end: 45.0, text: "Of course, I'll email a confirmation within the hour. Is there anything else I can help with?" },
  ],
};

const joinText = (segments) => segments.map((s) => s.text).join(' ');

const airlineSegments = [
  { start: 0, end: 5.5, text: 'Thanks for holding. I can see the cancelled flight on the booking.' },
  { start: 5.5, end: 14.0, text: 'The refund request was received and is under review. We will update the portal once it has been approved.' },
  { start: 14.0, end: 21.2, text: 'Is there a timeline? It has been three weeks since the cancellation notice.' },
];

export const seedTranscripts = [
  { id: 'tr-1001', caseId: 'WP-24018', fileName: 'Retailer_Support_Call_16Sep.mp3', duration: sampleTranscript.duration, createdAt: ts('09-16', '18:23'), language: 'en', text: joinText(sampleTranscript.segments), segments: sampleTranscript.segments },
  { id: 'tr-1002', caseId: 'WP-24014', fileName: 'Airline_Support_Call.m4a', duration: 118, createdAt: ts('09-24', '15:02'), language: 'en', text: joinText(airlineSegments), segments: airlineSegments },
];

export const joinSegments = joinText;
