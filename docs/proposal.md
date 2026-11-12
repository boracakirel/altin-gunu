# Altın Günü — Twitch/Kick App Proposal

## Overview

**Altın Günü** is an interactive livestream game where viewers join a virtual gathering through Twitch or Kick chat.

Participants bring a food item, appear as characters in a large hall, and collectively unlock gold showers and dance celebrations. At the end of the session, the streamer can view participation statistics and results.

**Feasibility:** The app is technically achievable using official Twitch and Kick APIs and a browser-based game displayed in OBS.

This document describes the proposed scope. Recommendations and outstanding decisions are not yet finalized requirements.

## 1. Core Gameplay

### Joining the game

Viewers participate using commands such as:

```text
katıl-sarma
katıl-kısır
katıl-ıslak kek
```

Convenient alternatives can also be supported:

```text
!katil sarma
katil-kisir
katil-islak kek
```

The command parser accepts capitalization differences, extra spaces, and Turkish/ASCII spelling variations.

### Recommended participation rules

- Each platform account joins once per session.
- Repeated commands do not create duplicate participants.
- Participants may change their food selection.
- Food changes update the relevant counters without increasing participant totals.
- Invalid commands and ordinary chat messages do not join the game.
- Twitch and Kick accounts remain separate unless explicit account linking is introduced.

### Food counters

The upper-right corner displays live totals:

```text
Sarma: 100
Kısır: 72
Islak Kek: 59
```

These totals represent all registered participants, regardless of how many avatars are currently visible.

### Gold celebrations

Every **10 unique participants** triggers a gold shower.

**Proposed MVP behavior:**

- Gold is automatically added to a communal virtual total.
- Each shower awards a configurable amount.
- Gold is purely in-game currency, separate from donations or real money.

**Decision pending:** Whether viewers should actively collect gold instead.

### Dance celebrations

Every **50 unique participants** triggers:

- Music.
- A 20-second group dance.
- A return to seated positions afterward.

Additional dance celebrations are queued rather than overlapping. Gold showers may occur during a dance.

## 2. Visual Experience

Recommended presentation:

- Landscape **1920×1080** OBS scene.
- Stylized 2D Turkish living room or event hall.
- Sofas, chairs, tables, and a central dance area.
- Participant avatars with food icons.
- Food counters in the upper-right corner.
- Gold particles and celebration effects.
- A milestone indicator, such as: **“Göbek havasına 12 kişi kaldı!”**

All participants count toward gameplay, but the number of detailed, simultaneously animated avatars can be limited for performance. Larger audiences can use simplified crowds or rotating highlighted participants. Visible-avatar limits should be determined through OBS performance testing.

Music and artwork should be original or appropriately licensed.

## 3. Streamer Controls

A separate dashboard provides:

- Start, pause, and end session.
- Platform connection status.
- Food and participant totals.
- Music volume and mute controls.
- Participant removal and name hiding.
- Simulated chat events for testing.
- Final reports and exports.

A platform disconnection should display a warning—not automatically erase or finalize the session. Moderation rules should distinguish hiding an avatar from removing participation; their effects on totals must be agreed before implementation.

## 4. Session Results

At the end of a session, show:

- Total unique participants.
- Final totals for each food.
- Most popular food.
- Session duration.
- Dance rounds and actual elapsed dance time.
- Number of gold showers.
- Total virtual gold awarded.
- Participation over time.

Support **CSV and JSON exports**.

## 5. Technical Architecture

```text
Twitch integration ─┐
                    ├─> Command parser → Game engine → Database
Kick integration ───┘                         │
                                              └─> Live updates
                                                   ├─ OBS scene
                                                   └─ Dashboard
```

The backend is the authoritative source of game state. Refreshing the OBS scene or opening another preview must not reset counters or duplicate rewards.

### Recommended technology

| Component | Technology |
|---|---|
| Language | TypeScript |
| Backend | Node.js + Fastify |
| Game rendering | PixiJS |
| Dashboard | React + Vite |
| Live updates | WebSocket |
| MVP database | SQLite |
| Testing | Vitest + Playwright |

### Twitch integration

- OAuth authorization.
- Official EventSub chat events.
- WebSocket transport for a local prototype.
- Token-expiry and reconnection handling.
- Visible warnings for connection gaps.

Unexpected outages may cause missed messages; Twitch does not replay events lost during an unexpected WebSocket disconnection.

### Kick integration

- Official `chat.message.sent` webhook events.
- Publicly accessible webhook endpoint.
- Webhook signature verification.
- Duplicate-delivery protection.
- Development tunnel for testing; hosted backend recommended for production.

Credentials must not be exposed in the OBS page. Platform integrations should request only the permissions needed for the selected features.

## 6. Reference Repository Assessment

Reference: <https://github.com/furkancavlak/tiktok-oyun-fabrikasi>

The assessment is based on a source and documentation review, not a runtime test.

### Useful elements

- Browser-rendered animated characters.
- Platform-event translation.
- Character, particle, and music systems.
- Streamer moderation panel.
- Simulated viewers.
- Automated browser testing.
- MIT-licensed code.

### Differences requiring changes

- TikTok connector instead of Twitch/Kick integrations.
- Any comment joins a participant.
- Portrait-oriented scene.
- Limited visible roster.
- Inactive characters removed automatically.
- Gift-driven mechanics rather than participation milestones.
- Limited browser-side persistence.

**Recommendation:** Build a standalone app, using the repository as a reference and selectively reusing suitable code with the required license notices.

The reference roster should not become the authoritative participant database: visible-character changes must not corrupt participant totals or milestone counts.

## 7. Development Roadmap

### Phase 1 — Confirm rules and scope

Agree on:

- Food list and commands.
- Gold collection behavior.
- Food-change rules.
- Moderation effects on participation and totals.
- Pause, resume, and session-ending behavior.
- Visual style.
- Initial platform.
- Single-streamer versus multi-streamer scope.

### Phase 2 — Offline playable prototype

Build:

- Hall and avatars.
- Food counters.
- Gold showers.
- Dance animations and music.
- Simulated participation.

**Acceptance criterion:** 100 unique joins produce 10 gold milestones and 2 dance celebrations, with dance celebrations queued when necessary.

### Phase 3 — Persistence and reliability

Add:

- Durable sessions.
- Participant and event deduplication.
- Milestone queue.
- Restart recovery.
- Consistent state across dashboard and OBS.

**Acceptance criterion:** Refreshes and restarts preserve totals without replaying completed rewards. Recovery behavior for interrupted animations is explicitly defined and tested.

### Phase 4 — Twitch integration

Add OAuth, chat ingestion, connection monitoring, and OBS setup.

**Acceptance criterion:** A real Twitch chat command updates the counters and scene correctly.

### Phase 5 — Kick integration

Add webhook delivery, signature verification, and event subscriptions.

**Acceptance criterion:** Kick commands follow the same game rules as Twitch commands.

### Phase 6 — Reports and release testing

Add final reports, exports, moderation, and performance testing.

Test:

- Repeated joins.
- Turkish command variations.
- Food changes.
- Duplicate event deliveries.
- Joining during dancing.
- Traffic bursts.
- Reconnection.
- Ending during an animation.
- Long-running sessions.
- OBS refreshes and simultaneous previews.

## 8. Recommended MVP Scope

- One streamer.
- One active session.
- Twitch first; Kick second.
- Three initial foods: sarma, kısır, and ıslak kek.
- One 2D room.
- Free chat-based participation.
- Automatic communal virtual gold.
- Food changes allowed.
- No payment integrations.
- No public multi-streamer service initially.

## 9. Outstanding Decisions

1. Is the app for one channel or many streamers?
2. Should Twitch or Kick launch first?
3. Is gold automatically awarded or actively collected?
4. Is a landscape 2D cartoon style suitable?
5. Should participants be allowed to change food?
6. Should both platforms be able to feed a shared session?

**Recommended next step:** Confirm these decisions, then build the offline prototype before connecting a real livestream.

## References

- [Example repository](https://github.com/furkancavlak/tiktok-oyun-fabrikasi)
- [Twitch chat documentation](https://dev.twitch.tv/docs/chat/)
- [Twitch EventSub WebSockets](https://dev.twitch.tv/docs/eventsub/handling-websocket-events/)
- [Kick events setup](https://docs.kick.com/events/introduction)
- [Kick webhook security](https://docs.kick.com/events/webhook-security)
