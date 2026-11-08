Feature: Durable volunteer assignment (FR-014, FR-016, FR-018, FR-019)
  Scenario: Assigned volunteer recovers missed notification
    Given a coordinator has an approved relief request
    And an available volunteer is disconnected from the websocket
    When the coordinator assigns the volunteer
    Then the assignment, notification and audit are stored in PostgreSQL
    When the volunteer reconnects and fetches unread notifications
    Then the volunteer sees the pending assignment

  Scenario: Concurrent duplicate assignment prevents double effects
    Given one approved request and one available volunteer
    When two assignment commands race with different idempotency keys
    Then business constraints prevent unintended duplicate active work
    And the outbox has no duplicate effective domain transition

  Scenario: Unauthorized user cannot accept an assignment
    Given an assignment belongs to volunteer A
    When volunteer B tries to accept it
    Then the API denies the request
    And the assignment remains PENDING
