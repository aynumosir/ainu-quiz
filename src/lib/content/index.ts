import { bundle as base } from './course';
import { generated } from './course-generated';
import type { ContentBundle, CourseNode, Sentence, Unit, Vocab } from './types';

/** Hand-curated Section 1 + the textbook-sequenced, MCP-verified generated sections. */
export const bundle: ContentBundle = {
	course: { ...base.course, sections: [...base.course.sections, ...generated.sections] },
	vocab: { ...base.vocab, ...generated.vocab },
	sentences: { ...base.sentences, ...generated.sentences },
	stories: { ...base.stories, ...generated.stories }
};
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

/**
 * Vocab + sentences from the OTHER nodes in the same unit as `nodeId`. Used to
 * widen the pool on repeat passes so a node's second play isn't a duplicate.
 */
export function unitContentFor(nodeId: string): { vocab: Vocab[]; sentences: Sentence[] } {
	const unit = course.sections
		.flatMap((s) => s.units)
		.find((u) => u.nodes.some((n) => n.id === nodeId));
	if (!unit) return { vocab: [], sentences: [] };
	const vIds = new Set<string>();
	const sIds = new Set<string>();
	for (const n of unit.nodes) {
		if (n.id === nodeId) continue;
		(n.vocab ?? []).forEach((id) => vIds.add(id));
		(n.sentences ?? []).forEach((id) => sIds.add(id));
	}
	return {
		vocab: [...vIds].map((id) => bundle.vocab[id]).filter(Boolean) as Vocab[],
		sentences: [...sIds].map((id) => bundle.sentences[id]).filter(Boolean) as Sentence[]
	};
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
