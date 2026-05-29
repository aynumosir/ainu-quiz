import { bundle } from './course';
import type { CourseNode, Sentence, Unit, Vocab } from './types';

export { bundle };
export const course = bundle.course;

export interface FlatNode {
	node: CourseNode;
	unit: Unit;
	unitIndex: number;
	indexInUnit: number;
	globalIndex: number;
}

/** All path nodes in traversal order, with their unit + position. */
export function flatNodes(): FlatNode[] {
	const out: FlatNode[] = [];
	let unitIndex = 0;
	let globalIndex = 0;
	for (const section of course.sections) {
		for (const unit of section.units) {
			unit.nodes.forEach((node, indexInUnit) => {
				out.push({ node, unit, unitIndex, indexInUnit, globalIndex: globalIndex++ });
			});
			unitIndex++;
		}
	}
	return out;
}

export function vocabById(id: string): Vocab | undefined {
	return bundle.vocab[id];
}

export function sentenceById(id: string): Sentence | undefined {
	return bundle.sentences[id];
}

export function nodeById(id: string): CourseNode | undefined {
	return flatNodes().find((f) => f.node.id === id)?.node;
}

/** Resolve a node's vocab + sentence objects (skipping any dangling ids). */
export function nodeContent(node: CourseNode): { vocab: Vocab[]; sentences: Sentence[] } {
	return {
		vocab: (node.vocab ?? []).map((id) => bundle.vocab[id]).filter(Boolean) as Vocab[],
		sentences: (node.sentences ?? []).map((id) => bundle.sentences[id]).filter(Boolean) as Sentence[]
	};
}

export const XP_BY_TYPE: Record<CourseNode['type'], number> = {
	lesson: 15,
	review: 10,
	unitReview: 20,
	story: 12,
	practice: 10
};
