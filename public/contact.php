<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/security.php';

security_set_response_headers();

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  security_json_fail(405, 'Method not allowed');
}

$allowedHosts = security_env_list('APP_ALLOWED_HOSTS', [
  'nontronics.com',
  'nontronics.tech',
  'www.nontronics.tech',
  'www.nontronics.com',
  'localhost',
  '127.0.0.1',
]);

$currentHost = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));
if ($currentHost !== '') {
  $allowedHosts[] = $currentHost;
}

if (!security_is_allowed_origin($allowedHosts)) {
  security_json_fail(403, 'Origin denied');
}

$requestIp = security_get_client_ip();
if (!security_rate_limit('contact_' . $requestIp, 8, 600)) {
  security_json_fail(429, 'Too many requests. Please try again later.');
}

// Read JSON body
$raw = file_get_contents('php://input');
$maxPayloadBytes = 2 * 1024 * 1024;
if ($raw === false || strlen($raw) > $maxPayloadBytes) {
  security_json_fail(413, 'Payload too large');
}

$data = json_decode($raw, true);

if (!is_array($data)) {
  security_json_fail(400, 'Invalid request body');
}

// Extract fields
$name        = security_clean_text($data['name'] ?? '', 120);
$email       = security_clean_text($data['email'] ?? '', 254);
$phone       = security_clean_text($data['phone'] ?? '', 40);
$service     = security_clean_text($data['service'] ?? '', 64);
$category    = security_clean_text($data['category'] ?? '', 64);
$device      = security_clean_text($data['device'] ?? '', 64);
$brand       = security_clean_text($data['brand'] ?? '', 64);
$performance = security_clean_text($data['performance'] ?? '', 64);
$area        = security_clean_text($data['area'] ?? '', 40);
$budget      = security_clean_text($data['budget'] ?? '', 60);
$message     = security_clean_text($data['message'] ?? '', 4000);
$photoBase64 = trim((string) ($data['photoBase64'] ?? ''));
$photoFileName = trim((string) ($data['photoFileName'] ?? ''));
$meta        = $data['meta'] ?? [];

$trapField = security_clean_text($data['website'] ?? '', 32);
$formStartedAt = (int) ($data['formStartedAt'] ?? 0);

if ($trapField !== '') {
  security_json_fail(400, 'Invalid submission');
}

if ($formStartedAt > 0) {
  $elapsed = time() - $formStartedAt;
  if ($elapsed < 2 || $elapsed > 7200) {
    security_json_fail(400, 'Invalid submission timing');
  }
}

foreach ([$name, $email, $phone, $service, $category, $device, $brand, $performance, $area, $budget, $message] as $field) {
  if (security_contains_suspicious_payload($field)) {
    security_json_fail(400, 'Suspicious payload detected');
  }
}

// Validate and sanitize photo data if present
$photoAttachmentPath = null;
if (!empty($photoBase64) && !empty($photoFileName)) {
    // Validate base64
    if (preg_match('/^data:image\/(jpeg|png|webp);base64,/', $photoBase64, $matches)) {
        // Extract base64 content
    $parts = explode(',', $photoBase64, 2);
    $photoData = isset($parts[1]) ? base64_decode($parts[1], true) : false;
        if ($photoData === false) {
      security_json_fail(400, 'Invalid photo data');
        }

    if (strlen($photoData) > 10 * 1024 * 1024) {
      security_json_fail(413, 'Photo exceeds 10MB limit');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $detectedMime = $finfo ? finfo_buffer($finfo, $photoData) : '';
    if ($finfo) {
      finfo_close($finfo);
    }

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($detectedMime, $allowedMimes, true)) {
      security_json_fail(400, 'Unsupported photo type');
    }
        
        // Sanitize filename
    $photoFileName = security_sanitize_filename($photoFileName);
    if ($photoFileName === '') {
      $photoFileName = 'upload.' . ($matches[1] === 'jpeg' ? 'jpg' : $matches[1]);
    }
        
        // Create temp path
        $tempDir = sys_get_temp_dir() . '/nontronics-uploads';
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        
        $photoAttachmentPath = $tempDir . '/' . md5(time() . $email) . '_' . $photoFileName;
        
        // Write file
        if (file_put_contents($photoAttachmentPath, $photoData) === false) {
      security_json_fail(500, 'Failed to process photo');
        }
    }
}

// Basic validation (frontend already validates, this is just a safety net)
if ($name === '' || $email === '' || $service === '' || $category === '' || $message === '') {
  security_json_fail(400, 'Missing required fields');
}

if (!security_validate_email($email)) {
  security_json_fail(400, 'Invalid email address');
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

$repairDeviceLabels = [
  'phone' => 'Phone',
  'tablet' => 'Tablet',
  'laptop' => 'Laptop',
  'desktop_pc' => 'Desktop PC',
  'tv' => 'TV',
  'monitor' => 'Monitor',
  'smartwatch' => 'Smartwatch',
  'console' => 'Console',
  'controller' => 'Controller',
  'handheld' => 'Handheld',
  'audio_device' => 'Audio Device',
  'other' => 'Other',
];

$repairBrandLabels = [
  'apple' => 'Apple',
  'samsung' => 'Samsung',
  'google' => 'Google',
  'sony' => 'Sony',
  'lg' => 'LG',
  'microsoft' => 'Microsoft',
  'nintendo' => 'Nintendo',
  'valve' => 'Valve',
  'asus' => 'ASUS',
  'acer' => 'Acer',
  'dell' => 'Dell',
  'hp' => 'HP',
  'lenovo' => 'Lenovo',
  'msi' => 'MSI',
  'razer' => 'Razer',
  'other' => 'Other',
];

$consoleBrandLabels = [
  'sony' => 'Sony / PlayStation',
  'microsoft' => 'Microsoft / Xbox',
  'nintendo' => 'Nintendo',
  'valve' => 'Valve / Steam',
  'other' => 'Other Console Brand',
];

$performanceLabels = [
  'budget_low_end' => 'Budget / Low End',
  'entry_mid_range' => 'Entry Mid-Range',
  'mid_range' => 'Mid-Range',
  'high_end' => 'High End',
  'enthusiast' => 'Enthusiast',
  'ultra_high_end' => 'Ultra High End',
];

$serviceCategoryMap = [
  'repairs' => [
    'general_damage',
    'screen_replacement',
    'battery_service',
    'controller_repair',
    'firmware_recovery_repair',
    'diagnostics_troubleshooting',
  ],
  'modifications' => [
    'pc_modifications',
    'controller_modifications',
    'console_modifications',
    'custom_shells_aesthetics',
    'led_modifications',
  ],
  'builds' => [
    'gaming_pc_builds',
    'workstation_builds',
    'compact_itx_builds',
  ],
  'general_inquiry' => [
    'general_question',
    'quote_question',
    'order_or_status_question',
    'business_or_partnership',
    'other_non_service',
  ],
];

  if (!array_key_exists($service, $serviceLabels)) {
    security_json_fail(400, 'Invalid service value');
  }

  $validCategoryValues = array_map(
    static function (string $key): string {
      return strtolower(trim($key));
    },
    array_keys($categoryLabels)
  );

  if (!in_array(strtolower($category), $validCategoryValues, true)) {
    security_json_fail(400, 'Invalid category value');
  }

  $allowedCategoriesForService = $serviceCategoryMap[$service] ?? [];
  if (!in_array($category, $allowedCategoriesForService, true)) {
    security_json_fail(400, 'Category does not match selected service');
  }

  $requiresRepairDeviceAndBrand = $service === 'repairs';
  $requiresConsoleBrand =
    $service === 'modifications' &&
    in_array($category, ['console_modifications', 'controller_modifications'], true);
  $requiresBuildPerformance = $service === 'builds';

  if ($requiresRepairDeviceAndBrand) {
    if ($device === '' || !array_key_exists($device, $repairDeviceLabels)) {
      security_json_fail(400, 'Invalid device value for repairs');
    }
    if ($brand === '' || !array_key_exists($brand, $repairBrandLabels)) {
      security_json_fail(400, 'Invalid brand value for repairs');
    }
  } else {
    $device = '';
  }

  if ($requiresConsoleBrand) {
    if ($brand === '' || !array_key_exists($brand, $consoleBrandLabels)) {
      security_json_fail(400, 'Invalid brand value for selected modification category');
    }
  } elseif (!$requiresRepairDeviceAndBrand) {
    $brand = '';
  }

  if ($requiresBuildPerformance) {
    if ($performance === '' || !array_key_exists($performance, $performanceLabels)) {
      security_json_fail(400, 'Invalid performance value for builds');
    }
  } else {
    $performance = '';
  }

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
$deviceLabel      = $repairDeviceLabels[$device] ?? $toTitle($device);
$brandLabel       = $repairBrandLabels[$brand] ?? ($consoleBrandLabels[$brand] ?? $toTitle($brand));
$performanceLabel = $performanceLabels[$performance] ?? $toTitle($performance);
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

// Business configuration (env-driven)
$businessName = security_env('BUSINESS_NAME', 'Nontronics Group');
$businessBrand = security_env('BUSINESS_BRAND', 'Nontronics');

$adminEmail = security_env('CONTACT_ADMIN_EMAIL', '');
$adminEmails = security_env_list('CONTACT_ADMIN_CC', []);

$logoUrl = security_env('LOGO_URL', 'https://nontronics.com/assets/nontronicsbwplog.png');
$noticeLogoUrl = security_env('NOTICE_LOGO_URL', 'https://nontronics.com/assets/nontronicslog.png');

// SMTP settings
$smtpHost = security_env('SMTP_HOST', '');
$smtpUsername = security_env('SMTP_USERNAME', '');
$smtpPassword = security_env('SMTP_PASSWORD', '');
$smtpPort = security_env_int('SMTP_PORT', 587);
$smtpEncryptionEnv = strtolower((string) security_env('SMTP_ENCRYPTION', 'tls'));
$smtpEncryption = $smtpEncryptionEnv === 'ssl'
  ? PHPMailer::ENCRYPTION_SMTPS
  : PHPMailer::ENCRYPTION_STARTTLS;

$fromEmail = security_env('SMTP_FROM_EMAIL', '');
$fromName = security_env('SMTP_FROM_NAME', $businessName);

if (
  $adminEmail === '' ||
  $smtpHost === '' ||
  $smtpUsername === '' ||
  $smtpPassword === '' ||
  $fromEmail === ''
) {
  security_json_fail(500, 'Server mail configuration is incomplete.');
}

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
$safeDevice      = htmlspecialchars($deviceLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeBrand       = htmlspecialchars($brandLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safePerformance = htmlspecialchars($performanceLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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

if ($safeDevice !== '') {
    $userHtml .= <<<HTML
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Device</td>
              <td style="padding:4px 0;">{$safeDevice}</td>
            </tr>
HTML;
}

if ($safeBrand !== '') {
    $userHtml .= <<<HTML
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Brand</td>
              <td style="padding:4px 0;">{$safeBrand}</td>
            </tr>
HTML;
}

if ($safePerformance !== '') {
    $userHtml .= <<<HTML
            <tr>
              <td style="padding:4px 0;color:#9ca3af;">Performance</td>
              <td style="padding:4px 0;">{$safePerformance}</td>
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
        <p style="margin:8px 0 0 0;font-size:11px;line-height:1.6;color:#6b7280;">
          This email is a valid receipt for request confirmation and future reference, including agreement to our Terms of Service, Privacy Policy, Shipping Policy, and Repair / Service Terms. This email is not proof of payment.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:7px 14px;background:#1a2234;border-top:1px solid #273449;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:10px;line-height:1;color:#b7c3d6;">
          <tr>
            <td style="white-space:nowrap;vertical-align:middle;">2026 NONTRONICS LLC.</td>
            <td style="text-align:right;vertical-align:middle;">
              <img src="{$noticeLogoUrl}" alt="Nontronics" style="display:inline-block;height:12px;max-width:90px;vertical-align:middle;" />
            </td>
          </tr>
        </table>
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
    . ($deviceLabel ? "Device: {$deviceLabel}\n" : '')
    . ($brandLabel ? "Brand: {$brandLabel}\n" : '')
    . ($performanceLabel ? "Performance: {$performanceLabel}\n" : '')
    . ($areaLabel ? "Area: {$areaLabel}\n" : '')
    . ($budget ? "Budget: {$budget}\n" : '')
    . "\nMessage:\n{$message}\n"
    . "\n2026 NONTRONICS LLC.\n"
    . "\nThis email is a valid receipt for request confirmation and future reference, including agreement to the Terms of Service, Privacy Policy, Shipping Policy, and Repair / Service Terms. This email is not proof of payment.\n";

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

if ($safeDevice !== '') {
  $adminHtml .= "<strong>Device:</strong> {$safeDevice}<br/>";
}

if ($safeBrand !== '') {
  $adminHtml .= "<strong>Brand:</strong> {$safeBrand}<br/>";
}

if ($safePerformance !== '') {
  $adminHtml .= "<strong>Performance:</strong> {$safePerformance}<br/>";
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
          <p style="margin:8px 0 0 0;font-size:11px;line-height:1.6;color:#6b7280;">
            This email is a valid receipt for request confirmation and future reference, including agreement to our Terms of Service, Privacy Policy, Shipping Policy, and Repair / Service Terms. This email is not proof of payment.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:7px 14px;background:#1a2234;border-top:1px solid #273449;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:10px;line-height:1;color:#b7c3d6;">
          <tr>
            <td style="white-space:nowrap;vertical-align:middle;">2026 NONTRONICS LLC.</td>
            <td style="text-align:right;vertical-align:middle;">
              <img src="{$noticeLogoUrl}" alt="Nontronics" style="display:inline-block;height:12px;max-width:90px;vertical-align:middle;" />
            </td>
          </tr>
        </table>
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
    . ($deviceLabel ? "Device: {$deviceLabel}\n" : '')
    . ($brandLabel ? "Brand: {$brandLabel}\n" : '')
    . ($performanceLabel ? "Performance: {$performanceLabel}\n" : '')
    . ($budget ? "Budget: {$budget}\n" : '')
    . "\nMessage:\n{$message}\n"
    . "\n2026 NONTRONICS LLC.\n"
    . "\nThis email is a valid receipt for request confirmation and future reference, including agreement to the Terms of Service, Privacy Policy, Shipping Policy, and Repair / Service Terms. This email is not proof of payment.\n";

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
      'message' => 'Unable to send email at this time.',
    ]);
}

