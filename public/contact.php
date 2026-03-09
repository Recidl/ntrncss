<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

header('Content-Type: application/json');

// Read JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body']);
    exit;
}

// Extract fields
$name        = trim($data['name'] ?? '');
$email       = trim($data['email'] ?? '');
$phone       = trim($data['phone'] ?? '');
$service     = trim($data['service'] ?? '');
$category    = trim($data['category'] ?? '');
$area        = trim($data['area'] ?? '');
$budget      = trim($data['budget'] ?? '');
$message     = trim($data['message'] ?? '');
$photoBase64 = trim($data['photoBase64'] ?? '');
$photoFileName = trim($data['photoFileName'] ?? '');
$meta        = $data['meta'] ?? [];

// Validate and sanitize photo data if present
$photoAttachmentPath = null;
if (!empty($photoBase64) && !empty($photoFileName)) {
    // Validate base64
    if (preg_match('/^data:image\/(jpeg|png|webp);base64,/', $photoBase64, $matches)) {
        // Extract base64 content
        $photoData = base64_decode(explode(',', $photoBase64)[1]);
        if ($photoData === false) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid photo data']);
            exit;
        }
        
        // Sanitize filename
        $photoFileName = preg_replace('/[^a-zA-Z0-9._-]/', '', $photoFileName);
        $photoFileName = preg_replace('/_+/', '_', $photoFileName);
        
        // Create temp path
        $tempDir = sys_get_temp_dir() . '/nontronics-uploads';
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        
        $photoAttachmentPath = $tempDir . '/' . md5(time() . $email) . '_' . $photoFileName;
        
        // Write file
        if (file_put_contents($photoAttachmentPath, $photoData) === false) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to process photo']);
            exit;
        }
    }
}

// Basic validation (frontend already validates, this is just a safety net)
if ($name === '' || $email === '' || $service === '' || $category === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Map internal codes to human-friendly labels
$serviceLabels = [
  'repairs'       => 'Repairs',
  'modifications' => 'Modifications',
  'builds'        => 'Builds',
  'general_inquiry' => 'General Inquiry / Question',
];

$categoryLabels = [
  'general_damage'               => 'General Damage',
  'screen_replacement'           => 'Screen Replacement',
  'battery_service'              => 'Battery Service',
  'controller_repair'            => 'Controller Repair',
  'firmware_recovery_repair'     => 'Firmware Recovery & Repair',
  'diagnostics_troubleshooting'  => 'Diagnostics & Troubleshooting',
  'pc_modifications'             => 'PC Modifications',
  'controller_modifications'     => 'Controller Modifications',
  'console_modifications'        => 'Console Modifications',
  'custom_shells_aesthetics'     => 'Custom Shells & Aesthetics',
  'led_modifications'            => 'LED Modifications',
  'gaming_pc_builds'             => 'Gaming PC Builds',
  'workstation_builds'           => 'Workstation Builds',
  'compact_itx_builds'           => 'Compact & ITX Builds',
  'general_question'             => 'General Question',
  'quote_question'               => 'Quote / Pricing Question',
  'order_or_status_question'     => 'Order or Status Question',
  'business_or_partnership'      => 'Business / Partnership Inquiry',
  'other_non_service'            => 'Other (Non-Service)',
];

// Helper for transforming snake_case into Title Case when we do not have a specific map
$toTitle = static function (?string $value): string {
    if (!$value) {
        return '';
    }
    $value = str_replace('_', ' ', (string) $value);
    return ucwords(strtolower($value));
};

$serviceLabel     = $serviceLabels[$service] ?? $toTitle($service);
$categoryLabel    = $categoryLabels[$category] ?? $toTitle($category);
$areaLabel        = $toTitle($area);

// Meta / proof info
$ipAddress   = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$forwardedIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$userAgent   = $_SERVER['HTTP_USER_AGENT'] ?? ($meta['userAgent'] ?? '');
$referrer    = $_SERVER['HTTP_REFERER'] ?? ($meta['referrer'] ?? '');
$submittedAt = date('Y-m-d H:i:s');

// -------------------------------------------------------------------------
// PHPMailer setup
// -------------------------------------------------------------------------

// PHPMailer 7.0.2 is bundled in /public/PHPMailer (copied from C:\PHPMailer-7.0.2)
// If you deploy to a different environment, make sure this relative path is still correct.
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

// Business configuration
$businessName = 'Nontronics Group';
$businessBrand = 'Nontronics';

$adminEmail = 'Nontronics@gmail.com';

// TODO: List of additional administrators to CC on admin emails (leave empty or add addresses)
$adminEmails = [
    // 'admin2@example.com',
    'aldo041510@gmail.com',
];

// TODO: Replace with the actual URL where your logo is hosted
$logoUrl = 'https://your-domain.com/assets/nontronicsbwplog.png';

// TODO: SMTP settings
$smtpHost       = 'smtp.example.com';        // e.g. smtp.gmail.com
$smtpUsername   = 'your-smtp-username';      // full SMTP username
$smtpPassword   = 'your-smtp-password';      // SMTP password or app-specific password
$smtpPort       = 587;                       // 587 for TLS, 465 for SSL, etc.
$smtpEncryption = PHPMailer::ENCRYPTION_STARTTLS; // Or PHPMailer::ENCRYPTION_SMTPS

// TODO: Set the "from" email and name that will appear to recipients
$fromEmail = 'no-reply@your-domain.com';
$fromName  = $businessName;

/**
 * Create a preconfigured PHPMailer instance.
 */
$createMailer = static function () use (
    $smtpHost,
    $smtpUsername,
    $smtpPassword,
    $smtpPort,
    $smtpEncryption,
    $fromEmail,
    $fromName
): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = $smtpEncryption;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';

    // If you are testing on a server with a self-signed certificate and
    // run into SSL issues, you can relax these options. For production,
    // it is best to keep certificate verification enabled.
    // $mail->SMTPOptions = [
    //     'ssl' => [
    //         'verify_peer'       => false,
    //         'verify_peer_name'  => false,
    //         'allow_self_signed' => true,
    //     ],
    // ];

    $mail->setFrom($fromEmail, $fromName);
    $mail->isHTML(true);

    return $mail;
};

// -------------------------------------------------------------------------
// Build email bodies
// -------------------------------------------------------------------------

$safeName        = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail       = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safePhone       = htmlspecialchars($phone, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeService     = htmlspecialchars($serviceLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeCategory    = htmlspecialchars($categoryLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeArea        = htmlspecialchars($areaLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeBudget      = htmlspecialchars($budget, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage     = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));

$safeIpAddress   = htmlspecialchars($ipAddress, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeForwardedIp = htmlspecialchars($forwardedIp, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeUserAgent   = htmlspecialchars((string) $userAgent, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeReferrer    = htmlspecialchars((string) $referrer, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeSubmittedAt = htmlspecialchars($submittedAt, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

// User confirmation email
$userHtml = <<<HTML
<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#0b0b10; color:#f4f4f8; padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#101018;overflow:hidden;border:1px solid #1f1f2a;">
    <tr>
      <td style="padding:20px 24px; background:linear-gradient(135deg, #3b82f6, #8b5cf6);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <div style="display:flex;align-items:center;gap:12px;">
                <!-- Logo -->
                <div style=\"width:40px;height:40px;background:rgba(15,23,42,0.15);display:flex;align-items:center;justify-content:center;overflow:hidden;\">
                  <!-- TODO: Ensure this URL points to your live logo asset -->
                  <img src="{$logoUrl}" alt="{$businessName} Logo" style="display:block;max-width:40px;max-height:40px;" />
                </div>
                <div style="color:#f9fafb;font-size:14px;letter-spacing:0.2em;text-transform:uppercase;font-family:system-ui, -apple-system;opacity:0.85;">
                  {$businessName}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 24px 8px 24px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;letter-spacing:0.08em;text-transform:uppercase;">Request Received</h1>
        <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#d1d5db;">
          Hi {$safeName},<br/>
          Thank you for reaching out to the <strong>{$businessName}</strong>. We&apos;ve received your request and emailed you this copy as proof of what you sent.
        </p>
        <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#d1d5db;">
          A member of the <strong>{$businessBrand}</strong> team will personally review your request and reply to begin discussing your quote and next steps. Feel free to call or email us again for any questions.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 24px 24px 24px;">
        <div style="border:1px solid #1f2937;background:linear-gradient(145deg, #0b1120, #020617);padding:16px 18px;">
          <h2 style="margin:0 0 10px 0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;">Your Request Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#e5e7eb;">
            <tr>
              <td style="padding:4px 0;width:32%;color:#9ca3af;">Name</td>
              <td style="padding:4px 0;">{$safeName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Email</td>
              <td style="padding:4px 0;">{$safeEmail}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Phone</td>
              <td style="padding:4px 0;">{$safePhone}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Service</td>
              <td style="padding:4px 0;">{$safeService}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Category</td>
              <td style="padding:4px 0;">{$safeCategory}</td>
            </tr>
HTML;

if ($safeArea !== '') {
    $userHtml .= <<<HTML
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Area</td>
              <td style="padding:4px 0;">{$safeArea}</td>
            </tr>
HTML;
}

if ($safeBudget !== '') {
    $userHtml .= <<<HTML
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Budget</td>
              <td style="padding:4px 0;">{$safeBudget}</td>
            </tr>
HTML;
}

$userHtml .= <<<HTML
            <tr>
              <td style="padding:8px 0 0 0;vertical-align:top;color:#9ca3af;">Message</td>
              <td style="padding:8px 0 0 0;vertical-align:top;">{$safeMessage}</td>
            </tr>
          </table>
        </div>
        <p style="margin:16px 0 0 0;font-size:12px;line-height:1.6;color:#6b7280;">
          If you didn&apos;t submit this request, you can safely ignore this email.
        </p>
      </td>
    </tr>
  </table>
</div>
HTML;

$userText = "{$businessName} - Request Received\n\n"
    . "We have received your message and will personally reply to begin discussing your quote.\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Service: {$serviceLabel}\n"
    . "Category: {$categoryLabel}\n"
    . ($areaLabel ? "Area: {$areaLabel}\n" : '')
    . ($budget ? "Budget: {$budget}\n" : '')
    . "\nMessage:\n{$message}\n";

// Admin email
$adminHtml = <<<HTML
<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color:#020617; color:#f9fafb; padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;margin:0 auto;background:#020617;overflow:hidden;border:1px solid #111827;">
    <tr>
      <td style="padding:20px 24px; background:linear-gradient(135deg, #3b82f6, #8b5cf6);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style=\"width:40px;height:40px;background:rgba(15,23,42,0.15);display:flex;align-items:center;justify-content:center;overflow:hidden;\">
                  <img src="{$logoUrl}" alt="{$businessName} Logo" style="display:block;max-width:40px;max-height:40px;" />
                </div>
                <div style="color:#f9fafb;font-size:14px;letter-spacing:0.2em;text-transform:uppercase;font-family:system-ui, -apple-system;opacity:0.9;">
                  {$businessName}
                </div>
              </div>
            </td>
            <td style="text-align:right;color:#e5e7eb;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;">
              New Contact / Quote
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 10px 24px;">
        <h1 style="margin:0 0 6px 0;font-size:18px;letter-spacing:0.12em;text-transform:uppercase;">New Submission</h1>
        <p style="margin:0 0 12px 0;font-size:13px;line-height:1.7;color:#d1d5db;">
          A new contact/quote request was submitted on the Nontronics site.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 24px 16px 24px;">
        <div style="display:flex;flex-wrap:wrap;gap:16px;">
          <div style="flex:1 1 260px;border:1px solid #1f2937;background:radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), #020617;padding:14px 16px;">
            <h2 style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;">Contact</h2>
            <p style="margin:0;font-size:13px;line-height:1.7;color:#e5e7eb;">
              <strong>Name:</strong> {$safeName}<br/>
              <strong>Email:</strong> {$safeEmail}<br/>
              <strong>Phone:</strong> {$safePhone}<br/>
              <strong>Area:</strong> {$safeArea}
            </p>
          </div>
          <div style="flex:1 1 260px;border:1px solid #1f2937;background:radial-gradient(circle at top left, rgba(129,140,248,0.16), transparent 55%), #020617;padding:14px 16px;">
            <h2 style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;">Request</h2>
            <p style="margin:0;font-size:13px;line-height:1.7;color:#e5e7eb;">
              <strong>Service:</strong> {$safeService}<br/>
              <strong>Category:</strong> {$safeCategory}<br/>
      HTML;
if ($safeBudget !== '') {
    $adminHtml .= "<strong>Budget:</strong> {$safeBudget}<br/>";
}

$adminHtml .= <<<HTML
            </p>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 18px 24px;">
        <div style="border:1px solid #1f2937;background:#020617;padding:14px 16px;">
          <h2 style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9ca3af;">Message</h2>
          <div style="font-size:13px;line-height:1.7;color:#e5e7eb;">
            {$safeMessage}
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 22px 24px;">
        <div style="border:1px dashed #1f2937;background:#020617;padding:10px 14px;">
          <h2 style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;">Administrator Tools / Proof</h2>
          <table cellpadding="0" cellspacing="0" style="font-size:11px;color:#9ca3af;">
            <tr>
              <td style="padding:3px 12px 3px 0;">Submitted at</td>
              <td style="padding:3px 0;">{$safeSubmittedAt}</td>
            </tr>
            <tr>
              <td style="padding:3px 12px 3px 0;">IP address</td>
              <td style="padding:3px 0;">{$safeIpAddress}</td>
            </tr>
HTML;

if ($safeForwardedIp !== '') {
    $adminHtml .= <<<HTML
            <tr>
              <td style="padding:3px 12px 3px 0;">Forwarded for</td>
              <td style="padding:3px 0;">{$safeForwardedIp}</td>
            </tr>
HTML;
}

$adminHtml .= <<<HTML
            <tr>
              <td style="padding:3px 12px 3px 0;vertical-align:top;">User agent</td>
              <td style="padding:3px 0;vertical-align:top;max-width:380px;word-break:break-all;">{$safeUserAgent}</td>
            </tr>
            <tr>
              <td style="padding:3px 12px 3px 0;vertical-align:top;">Referrer</td>
              <td style="padding:3px 0;vertical-align:top;max-width:380px;word-break:break-all;">{$safeReferrer}</td>
            </tr>
            <tr>
              <td style="padding:3px 12px 3px 0;vertical-align:top;">Raw service key</td>
              <td style="padding:3px 0;vertical-align:top;">{$service}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  </table>
</div>
HTML;

$adminText = "New {$businessName} contact/quote request\n\n"
    . "Submitted at: {$submittedAt}\n"
    . "IP: {$ipAddress}\n"
    . ($forwardedIp ? "Forwarded for: {$forwardedIp}\n" : '')
    . "User agent: {$userAgent}\n"
    . "Referrer: {$referrer}\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Area: {$areaLabel}\n"
    . "Service: {$serviceLabel}\n"
    . "Category: {$categoryLabel}\n"
    . ($budget ? "Budget: {$budget}\n" : '')
    . "\nMessage:\n{$message}\n";

// -------------------------------------------------------------------------
// Send messages
// -------------------------------------------------------------------------

try {
    // Send confirmation to customer
    $mailToCustomer = $createMailer();
    $mailToCustomer->addAddress($email, $name);
    $mailToCustomer->Subject = "{$businessName} – We received your request";
    $mailToCustomer->Body    = $userHtml;
    $mailToCustomer->AltBody = $userText;
    
    // Attach photo if provided
    if ($photoAttachmentPath && is_file($photoAttachmentPath)) {
        $mailToCustomer->addAttachment($photoAttachmentPath);
    }
    
    $mailToCustomer->send();

    // Send detailed copy to administrator
    $mailToAdmin = $createMailer();
    $mailToAdmin->addAddress($adminEmail, $businessName . ' Admin');
    foreach ($adminEmails as $ccEmail) {
        $ccEmail = trim($ccEmail);
        if ($ccEmail !== '') {
            $mailToAdmin->addCC($ccEmail);
        }
    }
    $mailToAdmin->addReplyTo($email, $name);
    $mailToAdmin->Subject = "{$businessName} – New contact / quote request from {$name}";
    $mailToAdmin->Body    = $adminHtml;
    $mailToAdmin->AltBody = $adminText;
    
    // Attach photo if provided
    if ($photoAttachmentPath && is_file($photoAttachmentPath)) {
        $mailToAdmin->addAttachment($photoAttachmentPath);
    }
    
    $mailToAdmin->send();

    // Clean up temporary photo file
    if ($photoAttachmentPath && is_file($photoAttachmentPath)) {
        unlink($photoAttachmentPath);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    
    // Clean up temporary photo file on error
    if ($photoAttachmentPath && is_file($photoAttachmentPath)) {
        unlink($photoAttachmentPath);
    }
    
    echo json_encode([
        'success' => false,
        'message' => 'Mail error: ' . $e->getMessage(),
    ]);
}

