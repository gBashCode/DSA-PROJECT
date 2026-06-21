export type Graph = Record<number, number[]>;

export interface GraphStep {
  visited: number[];
  frontier: number[];
  current: number;
  adjacencyList: Record<number, number[]>;
}

export function* bfs(
  graph: Graph,
  start: number
): Generator<GraphStep> {
  const visited: Set<number> = new Set();
  const queue: number[] = [start];
  visited.add(start);

  const adjacencyList: Record<number, number[]> = {};
  for (const key in graph) {
    adjacencyList[Number(key)] = [...graph[Number(key)]];
  }

  while (queue.length > 0) {
    const current = queue.shift()!;

    yield {
      visited: Array.from(visited),
      frontier: [...queue],
      current,
      adjacencyList: { ...adjacencyList },
    };

    const neighbors = graph[current] || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

export function* dfs(
  graph: Graph,
  start: number
): Generator<GraphStep> {
  const visited: Set<number> = new Set();
  const stack: number[] = [start];

  const adjacencyList: Record<number, number[]> = {};
  for (const key in graph) {
    adjacencyList[Number(key)] = [...graph[Number(key)]];
  }

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) continue;

    visited.add(current);

    yield {
      visited: Array.from(visited),
      frontier: [...stack],
      current,
      adjacencyList: { ...adjacencyList },
    };

    const neighbors = graph[current] || [];

    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}
