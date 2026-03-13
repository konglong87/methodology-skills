#!/usr/bin/env python3
"""
WeChat Article Infographic Generator

Generates concept diagrams, comparison tables, and flowcharts for WeChat articles.
Supports multiple style presets for different visual aesthetics.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from PIL import Image, ImageDraw, ImageFont


class InfographicGenerator:
    """Generates infographics for WeChat articles."""

    # Style presets with color palettes
    STYLES = {
        'notion': {
            'background': '#FFFFFF',
            'primary': '#EB5757',
            'secondary': '#F2994A',
            'accent': '#27AE60',
            'text': '#333333',
            'border': '#E0E0E0'
        },
        'warm': {
            'background': '#FFFBF0',
            'primary': '#D4A574',
            'secondary': '#E8B789',
            'accent': '#F4CFA7',
            'text': '#4A3B2A',
            'border': '#D4C4A8'
        },
        'minimal': {
            'background': '#FAFAFA',
            'primary': '#2C3E50',
            'secondary': '#34495E',
            'accent': '#7F8C8D',
            'text': '#2C3E50',
            'border': '#BDC3C7'
        },
        'bold': {
            'background': '#1A1A1A',
            'primary': '#FF6B6B',
            'secondary': '#4ECDC4',
            'accent': '#FFE66D',
            'text': '#FFFFFF',
            'border': '#333333'
        }
    }

    def __init__(self, style: str = 'minimal'):
        """Initialize the generator with a style preset."""
        if style not in self.STYLES:
            raise ValueError(f"Invalid style '{style}'. Must be one of: {list(self.STYLES.keys())}")
        self.style = self.STYLES[style]
        self.style_name = style

    def generate_concept_diagram(
        self,
        title: str,
        concepts: List[Dict[str, str]],
        output_path: str
    ) -> None:
        """
        Generate a concept diagram showing key concepts and relationships.

        Args:
            title: Diagram title
            concepts: List of concept dictionaries with 'name' and 'description'
            output_path: Path to save the generated image
        """
        fig, ax = plt.subplots(figsize=(12, 8))
        fig.patch.set_facecolor(self.style['background'])
        ax.set_facecolor(self.style['background'])

        # Set up the diagram
        ax.set_xlim(0, 12)
        ax.set_ylim(0, 8)
        ax.axis('off')

        # Add title
        ax.text(
            6, 7.5,
            title,
            fontsize=20,
            fontweight='bold',
            ha='center',
            color=self.style['text']
        )

        # Calculate positions for concepts
        num_concepts = len(concepts)
        positions = []
        if num_concepts <= 3:
            # Horizontal layout
            positions = [(3, 5), (6, 5), (9, 5)][:num_concepts]
        elif num_concepts <= 6:
            # 2x3 grid
            for i in range(num_concepts):
                row = i // 3
                col = i % 3
                positions.append((3 + col * 3, 5 - row * 2))
        else:
            # 3x3 grid
            for i in range(min(num_concepts, 9)):
                row = i // 3
                col = i % 3
                positions.append((2.5 + col * 3.5, 6 - row * 2))

        # Draw concepts as boxes
        for i, (concept, (x, y)) in enumerate(zip(concepts, positions)):
            # Choose color based on index
            colors = [self.style['primary'], self.style['secondary'], self.style['accent']]
            color = colors[i % len(colors)]

            # Draw box
            box = mpatches.Rectangle(
                (x - 1.2, y - 0.8),
                2.4, 1.6,
                facecolor=color,
                edgecolor=self.style['border'],
                linewidth=2,
                alpha=0.9,
                boxstyle='round,pad=0.1'
            )
            ax.add_patch(box)

            # Add concept name
            ax.text(
                x, y + 0.3,
                concept.get('name', f'Concept {i+1}'),
                fontsize=12,
                fontweight='bold',
                ha='center',
                color='white' if self.style_name == 'bold' else self.style['text']
            )

            # Add description (truncated if too long)
            desc = concept.get('description', '')
            if len(desc) > 60:
                desc = desc[:57] + '...'
            ax.text(
                x, y - 0.2,
                desc,
                fontsize=9,
                ha='center',
                va='center',
                wrap=True,
                color='white' if self.style_name == 'bold' else self.style['text']
            )

        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=self.style['background'])
        plt.close()

    def generate_comparison_table(
        self,
        title: str,
        items: List[Dict[str, str]],
        output_path: str
    ) -> None:
        """
        Generate a comparison table for comparing multiple items.

        Args:
            title: Table title
            items: List of items to compare, each with attributes
            output_path: Path to save the generated image
        """
        if not items:
            raise ValueError("Items list cannot be empty")

        # Extract all keys from items
        all_keys = set()
        for item in items:
            all_keys.update(item.keys())
        keys = sorted(all_keys)

        # Calculate dimensions
        num_items = len(items)
        num_keys = len(keys)
        cell_width = 200
        cell_height = 60
        title_height = 80
        header_height = 50

        total_width = cell_width * num_items
        total_height = title_height + header_height + cell_height * num_keys

        # Create image
        img = Image.new('RGB', (total_width, total_height), self.style['background'])
        draw = ImageDraw.Draw(img)

        # Try to load a font, fall back to default if not available
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 28)
            header_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 20)
            cell_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 16)
        except:
            title_font = ImageFont.load_default()
            header_font = ImageFont.load_default()
            cell_font = ImageFont.load_default()

        # Draw title
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        draw.text(
            ((total_width - title_width) // 2, 20),
            title,
            font=title_font,
            fill=self.style['text']
        )

        # Draw headers
        for i, item in enumerate(items):
            x = i * cell_width
            y = title_height

            # Choose color for column
            colors = [self.style['primary'], self.style['secondary'], self.style['accent']]
            color = colors[i % len(colors)]

            # Draw header background
            draw.rectangle(
                [x, y, x + cell_width, y + header_height],
                fill=color
            )

            # Draw header text
            item_name = list(item.values())[0] if item else f'Item {i+1}'
            header_bbox = draw.textbbox((0, 0), item_name, font=header_font)
            header_width = header_bbox[2] - header_bbox[0]
            draw.text(
                (x + (cell_width - header_width) // 2, y + 15),
                item_name,
                font=header_font,
                fill='white' if self.style_name == 'bold' else self.style['text']
            )

        # Draw cells
        for row_idx, key in enumerate(keys):
            y = title_height + header_height + row_idx * cell_height

            # Draw row background (alternating)
            bg_color = self.style['background']
            if row_idx % 2 == 1 and self.style_name != 'bold':
                bg_color = '#F0F0F0' if self.style_name == 'minimal' else '#F5F5DC'
            draw.rectangle(
                [0, y, total_width, y + cell_height],
                fill=bg_color,
                outline=self.style['border']
            )

            # Draw key label
            key_bbox = draw.textbbox((0, 0), key, font=cell_font)
            key_width = key_bbox[2] - key_bbox[0]
            draw.text(
                (10, y + 20),
                key,
                font=cell_font,
                fill=self.style['text']
            )

        # Draw item values
        for col_idx, item in enumerate(items):
            x = col_idx * cell_width

            for row_idx, key in enumerate(keys):
                y = title_height + header_height + row_idx * cell_height

                # Draw value
                value = str(item.get(key, ''))
                value_bbox = draw.textbbox((0, 0), value, font=cell_font)
                value_width = value_bbox[2] - value_bbox[0]

                # Truncate if too long
                if value_width > cell_width - 20:
                    # Simple truncation
                    max_chars = (cell_width - 20) // 10
                    value = value[:max_chars] + '...' if len(value) > max_chars else value

                draw.text(
                    (x + (cell_width - value_width) // 2, y + 20),
                    value,
                    font=cell_font,
                    fill=self.style['text']
                )

        img.save(output_path)


def parse_data(data_str: str) -> object:
    """
    Parse data string into appropriate format.

    Supports JSON format for complex data.
    """
    try:
        return json.loads(data_str)
    except json.JSONDecodeError:
        # Return as plain string if not valid JSON
        return data_str


def main():
    """CLI interface for the infographic generator."""
    parser = argparse.ArgumentParser(
        description='Generate infographics for WeChat articles'
    )
    parser.add_argument(
        '--type',
        choices=['concept-diagram', 'comparison-table'],
        required=True,
        help='Type of infographic to generate'
    )
    parser.add_argument(
        '--style',
        choices=['notion', 'warm', 'minimal', 'bold'],
        default='minimal',
        help='Style preset for the infographic'
    )
    parser.add_argument(
        '--title',
        required=True,
        help='Title for the infographic'
    )
    parser.add_argument(
        '--output',
        required=True,
        help='Output path for the generated image'
    )
    parser.add_argument(
        '--data',
        required=True,
        help='Data for the infographic (JSON format)'
    )

    args = parser.parse_args()

    # Initialize generator
    try:
        generator = InfographicGenerator(style=args.style)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    # Parse data
    data = parse_data(args.data)

    # Generate infographic
    try:
        if args.type == 'concept-diagram':
            if not isinstance(data, list):
                raise ValueError("Data must be a list of concept dictionaries")
            generator.generate_concept_diagram(args.title, data, args.output)
        elif args.type == 'comparison-table':
            if not isinstance(data, list):
                raise ValueError("Data must be a list of item dictionaries")
            generator.generate_comparison_table(args.title, data, args.output)

        print(f"Successfully generated {args.type} at {args.output}")
    except Exception as e:
        print(f"Error generating infographic: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()