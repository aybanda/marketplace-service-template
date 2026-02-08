import { Hono } from 'hono';
import { getProxy } from './proxy';
import { extractPayment, verifyPayment, build402Response } from './payment';

export const serviceRouter = new Hono();

// ─── INSTAGRAM ACCOUNT CREATOR (DRY-RUN) ─────────────
const SERVICE_NAME = 'instagram-account-creator';
const PRICE_USDC = 0.5;
const DESCRIPTION = 'Create Instagram accounts via mobile proxy + antidetect browser (dry-run simulation, no real accounts created).';

serviceRouter.post('/run', async (c) => {
  const walletAddress = process.env.WALLET_ADDRESS;
  if (!walletAddress) {
    return c.json({ error: 'Service misconfigured: WALLET_ADDRESS not set' }, 500);
  }

  // Payment gating
  const payment = extractPayment(c);
  if (!payment) {
    return c.json(
      build402Response('/api/run', DESCRIPTION, PRICE_USDC, walletAddress, {}),
      402,
    );
  }
  const verification = await verifyPayment(payment, walletAddress, PRICE_USDC);
  if (!verification.valid) {
    return c.json({ error: 'Payment verification failed', reason: verification.error }, 402);
  }

  // Simulate input extraction
  const input = await c.req.json();
  const username = input.username || 'demo_user_' + Math.floor(Math.random() * 10000);
  const password = input.password || 'StrongPass123!';
  const email = input.email || 'demo@example.com';

  // DRY-RUN: Simulate all flows
  // (No real Instagram interaction, all steps are stubs)
  const proxy = getProxy();

  // Simulate verification required
  if (input.verificationCode === undefined && Math.random() < 0.2) {
    return c.json({
      status: 'verification_required',
      message: 'Instagram requested a verification code. Provide verificationCode to complete signup.',
      proxy: { country: proxy.country, type: 'mobile' },
      session: { id: 'sess_' + Math.random().toString(36).slice(2), kept: true },
      payment: {
        txHash: payment.txHash,
        network: payment.network,
        amount: verification.amount,
        settled: true,
      },
      dryRun: true,
      notes: 'This is a dry-run simulation. No real Instagram account was created.'
    }, 409);
  }

  // Simulate account warming, shadowban, etc.
  // (All are no-ops in dry-run)

  c.header('X-Payment-Settled', 'true');
  c.header('X-Payment-TxHash', payment.txHash);

  return c.json({
    status: 'created',
    username,
    password,
    email,
    proxy: { country: proxy.country, type: 'mobile' },
    session: { id: 'sess_' + Math.random().toString(36).slice(2), kept: false },
    dryRun: true,
    notes: 'This is a dry-run simulation. No real Instagram account was created. All sensitive actions (CAPTCHA, SMS, warming, shadowban) are stubbed.'
  });
});

