export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number,
    left: TreeNode | null = null,
    right: TreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export interface TreeStep {
  tree: TreeNode | null;
  highlighted?: number[];
  sequence?: number[];
}

export function* insertIntoBST(
  root: TreeNode | null,
  val: number
): Generator<TreeStep> {
  const newNode = new TreeNode(val);

  if (root === null) {
    yield { tree: newNode, highlighted: [val], sequence: [val] };
    return;
  }

  let current = root;
  const sequence: number[] = [];
  const highlighted: number[] = [];

  while (true) {
    sequence.push(current.val);
    highlighted.push(current.val);

    yield {
      tree: root,
      highlighted: [...highlighted],
      sequence: [...sequence],
    };

    if (val < current.val) {
      if (current.left === null) {
        current.left = newNode;
        highlighted.push(val);

        yield {
          tree: root,
          highlighted: [...highlighted],
          sequence: [...sequence],
        };

        return;
      }
      current = current.left;
    } else {
      if (current.right === null) {
        current.right = newNode;
        highlighted.push(val);

        yield {
          tree: root,
          highlighted: [...highlighted],
          sequence: [...sequence],
        };

        return;
      }
      current = current.right;
    }
  }
}

export function* inorderTraversal(
  root: TreeNode | null
): Generator<TreeStep> {
  const sequence: number[] = [];
  const highlighted: number[] = [];

  function* inorder(node: TreeNode | null): Generator<TreeStep> {
    if (node === null) return;

    yield* inorder(node.left);

    sequence.push(node.val);
    highlighted.push(node.val);

    yield {
      tree: root,
      highlighted: [...highlighted],
      sequence: [...sequence],
    };

    yield* inorder(node.right);
  }

  yield* inorder(root);
}

export function* preorderTraversal(
  root: TreeNode | null
): Generator<TreeStep> {
  const sequence: number[] = [];
  const highlighted: number[] = [];

  function* preorder(node: TreeNode | null): Generator<TreeStep> {
    if (node === null) return;

    sequence.push(node.val);
    highlighted.push(node.val);

    yield {
      tree: root,
      highlighted: [...highlighted],
      sequence: [...sequence],
    };

    yield* preorder(node.left);
    yield* preorder(node.right);
  }

  yield* preorder(root);
}

export function* postorderTraversal(
  root: TreeNode | null
): Generator<TreeStep> {
  const sequence: number[] = [];
  const highlighted: number[] = [];

  function* postorder(node: TreeNode | null): Generator<TreeStep> {
    if (node === null) return;

    yield* postorder(node.left);
    yield* postorder(node.right);

    sequence.push(node.val);
    highlighted.push(node.val);

    yield {
      tree: root,
      highlighted: [...highlighted],
      sequence: [...sequence],
    };
  }

  yield* postorder(root);
}

export function* levelOrderTraversal(
  root: TreeNode | null
): Generator<TreeStep> {
  if (root === null) return;

  const queue: TreeNode[] = [root];
  const sequence: number[] = [];
  const highlighted: number[] = [];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelNodes: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      levelNodes.push(node.val);
      sequence.push(node.val);
      highlighted.push(node.val);

      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }

    yield {
      tree: root,
      highlighted: [...highlighted],
      sequence: [...sequence],
    };
  }
}
