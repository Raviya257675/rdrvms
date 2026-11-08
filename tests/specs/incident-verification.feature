Feature: Human incident verification (FR-007, FR-008, FR-013)
  As a coordinator I verify simulated incidents before they become actionable.

  Scenario: Scoped coordinator verifies a pending incident
    Given a registered reporter submitted an UNVERIFIED incident
    And a coordinator is authorized for its organization
    When the coordinator verifies the incident with a reason
    Then the incident status becomes VERIFIED
    And an audit event contains the actor and reason

  Scenario: Volunteer cannot verify an incident
    Given the user is an authenticated volunteer
    When the user calls the verification endpoint
    Then the server rejects authorization
    And the incident status is unchanged

  Scenario: Public incident listing is redacted
    Given a verified incident has a restricted exact location
    When a guest views incident summaries
    Then the exact location and reporter contact are not returned
