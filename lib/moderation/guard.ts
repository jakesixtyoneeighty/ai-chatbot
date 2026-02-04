type ModerationMessage = {
  parts: Array<{ type: string; text?: string }>;
};

export type ModerationDecision =
  | { action: "allow" }
  | { action: "block"; reason: string; response: string };

const EJECTION_RESPONSES = [
  "Gross. Seriously? Get the f--- out of here with that creepy s--t. This is a naturist space, not your personal wank bank. Go touch grass.",
  "Wow, reading that actually made me nauseous. You're barking up the wrong tree, weirdo. Delete this app and go work on yourself.",
  "Are you actually serious right now? We're talking about freedom and nature, and you make it about your d--k? That's pathetic. Get lost.",
];

const HARD_BLOCK_PATTERNS: RegExp[] = [
  /\b(roleplay|erp|sext(?:ing)?|sex\s*chat|dirty\s*talk)\b/i,
  /\b(send|show|share|give)\b.{0,12}\b(nudes?|porn|sex(?:\s*video|tape)?|tits?|boobs?|pussy|cock|dick|asshole|butthole|onlyfans)\b/i,
  /\b(make me (?:cum|orgasm)|get me off|turn me on)\b/i,
  /\b(i (?:want|need|gotta) (?:to )?(?:fuck|suck|lick|ride)|let'?s (?:fuck|suck|do it)|wanna (?:fuck|suck|do it))\b/i,
  /\b(can you|will you|would you)\b.{0,12}\b(fuck|suck|lick|touch|finger|ride|jerk)\b/i,
];

const SEX_ACT_REGEX =
  /\b(blowjob|handjob|oral sex|anal|penetrat(?:e|ion)|cum|cumming|orgasm|climax|masturbat(?:e|ion)|jerk off|jack off|wank|threesome)\b/i;

const BODY_PART_REGEX =
  /\b(cock|dick|pussy|tits?|boobs?|asshole|butthole|vagina|penis)\b/i;

const AROUSAL_REGEX =
  /\b(horny|aroused|turned on|hard|wet|boner|erection)\b/i;

const SOLICIT_REGEX =
  /\b(show|send|share|describe|tell|talk|give|let'?s|wanna|want to|can you|will you|would you|please)\b/i;

const SECOND_PERSON_REGEX = /\b(you|your|ur|u)\b/i;

const EDUCATIONAL_REGEX =
  /\b(is it normal|how do i|what should i|is it ok|is it okay|rules?|etiquette|allowed|policy|difference between|can you explain|why do|boundaries|consent|nonsexual|non sexual)\b/i;

function pickEjectionResponse(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % EJECTION_RESPONSES.length;
  return EJECTION_RESPONSES[index] ?? EJECTION_RESPONSES[0];
}

export function getModerationEjectionResponse(seed?: string) {
  if (!seed) {
    return EJECTION_RESPONSES[0];
  }
  return pickEjectionResponse(seed);
}

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function evaluateModeration(
  message?: ModerationMessage | null
): ModerationDecision {
  if (!message) {
    return { action: "allow" };
  }

  const text = normalizeText(
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("")
  );
  if (!text) {
    return { action: "allow" };
  }

  for (const pattern of HARD_BLOCK_PATTERNS) {
    if (pattern.test(text)) {
      return {
        action: "block",
        reason: "explicit_solicitation",
        response: pickEjectionResponse(text),
      };
    }
  }

  const hasSexAct = SEX_ACT_REGEX.test(text);
  const hasBodyPart = BODY_PART_REGEX.test(text);
  const hasArousal = AROUSAL_REGEX.test(text);
  const hasSolicit = SOLICIT_REGEX.test(text) && SECOND_PERSON_REGEX.test(text);
  const isEducational = EDUCATIONAL_REGEX.test(text);

  let score = 0;
  if (hasSexAct) score += 2;
  if (hasBodyPart) score += 2;
  if (hasArousal) score += 1;
  if (hasSolicit) score += 2;

  if (!isEducational && ((hasSexAct || hasBodyPart) && hasSolicit)) {
    return {
      action: "block",
      reason: "sexual_request",
      response: pickEjectionResponse(text),
    };
  }

  if (!isEducational && score >= 4) {
    return {
      action: "block",
      reason: "sexual_content",
      response: pickEjectionResponse(text),
    };
  }

  return { action: "allow" };
}
