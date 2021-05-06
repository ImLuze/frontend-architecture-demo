/**
 * @summary
 * Logic specific to this component.
 *
 * @description
 * The UI Logic determines which operations and models the component has access to and what
 * happens when certain operations or user events are triggered. Separating the logic from our
 * component allows us to write easier to understand unit tests and allows us to reuse UI Logic
 * for similar components with a different layout or styling.
 *
 * @example
 * useTodoComponent => { isCompleted, title, body, dueDate, completeTodo, removeTodo }
 * useChessPiece => { type, color, currentPosition, pickPieceUp }
 */
export interface UILogic<O, M> {
	operations: O;
	models: M;
}

/**
 * @summary
 * Application use cases and rules.
 *
 * @description
 * The Interaction layer is the decision making layer. This layer determines what we can or can't
 * do with our domain throughout the application. It enforces consistency by centralizing Behavior
 * Logic.
 *
 * Concerns:
 * 1. Map API DTOs (Data Transfer Objects) to useable models.
 * 2. Enforce rules and consistent behavior throughout the application.
 *
 * @example
 * useTodos => { createTodo, completeTodo, changeDueDate, removeTodo, todos, completedTodos }
 * useChess => { pickPieceUp, movePiece, validMoves, pieces }
 */
export interface InteractionLogic<O, M> {
	operations: O;
	models: M;
}
