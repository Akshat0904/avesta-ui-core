# Guidelines for Creating a New Use Case

## 1. Separation of Concerns

Each use case should have a **single responsibility**. The business logic, state management, and UI concerns must remain separate to keep the use case focused and maintainable.

-   **Presentation Layer:** Only handles UI events, delegating business logic to the use case.
-   **Use Case:** Manages the business logic.
-   **State Management:** Should not be handled inside the use case; use hooks or other means in the presentation layer.
-   **Repository Layer:** Handles data persistence and communication with external sources (APIs, databases).

## 2. Input Parameters

The `execute` method of the use case should only receive the **necessary input parameters** to perform its logic. All parameters must be typed appropriately.

-   Keep the input parameters minimal and focused on the task.
-   Input should represent business-level data (e.g., commands, filters), not UI-specific elements (like components or DOM nodes).

Example:

```typescript
export interface LocationChangeCommand {
	appliedFilters: TFilter[];
	searchKeyword: string;
	selectedLocations: TSelectedSearch[];
	fromModuleType: EModuleType;
}
```

# Guidelines for Creating a New Use Case

## 1. Folder Structure and File Naming Convention

All files related to a use case should follow a standardized naming and folder structure for consistency and ease of navigation.

### Folder Structure:

Each use case must reside within the `useCases` folder of its respective module. For example:

### File Naming Convention:

-   **Use Case File:** `[useCaseName].usecase.ts`
    -   Example: `mapPan.usecase.ts`
-   **Mapper File:** `[mapperName].mapper.ts`
    -   Example: `map.mapper.ts`
-   **Hook File:** `use[HookName].ts`
    -   Example: `useMapPan.ts`
-   **Types File:** `[typeName].types.ts`
    -   Example: `mapPan.types.ts`
-   **Command Object:** `[CommandName]Command.ts`
    -   Example: `LocationChangeCommand.ts`

**Important Rules:**

1. **Use Case Command:** Any data passed from a hook to the use case must have the suffix `Command` (e.g., `LocationChangeCommand`).
2. **Hook Naming:** Always prefix hook files with `use` to indicate their purpose.

---

## 2. Separation of Concerns

Maintain a clear separation of concerns between the different layers:

-   **Presentation Layer:** Handles UI interactions and delegates business logic to the use case.
-   **Use Case Layer:** Encapsulates all business logic, independent of UI concerns.
-   **Repository Layer:** Manages data persistence, such as communication with APIs or databases.

---

## 3. Dependency Injection and Inversion

Always follow **dependency inversion** when calling use cases. Inject all dependencies (services, repositories, etc.) via the constructor to ensure testability and decoupling from concrete implementations.

-   **Do not** create instances of services or repositories inside the use case.
-   **Do** inject dependencies to maintain flexibility.

Example:

```typescript
export class LocationChangeUseCase {
	constructor(
		private srAnalyticsService: ISrAnalyticsService,
		private listingSrRepository: ListingSrRepository,
		private cacheService: CacheService // other dependencies...
	) {}
}
```
