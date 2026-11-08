Feature: Inventory cannot become negative (FR-021, FR-022)
  Scenario: Last items cannot be reserved twice
    Given an inventory item has available quantity 5
    When two authorized coordinators concurrently reserve quantity 4
    Then no more than one reservation is committed
    And available quantity is never below zero
