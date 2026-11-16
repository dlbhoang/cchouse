"""Raw viewport comparison. Crop reference chrome only; never resize/recolour.

Usage: python3 compare_images.py reference actual output_prefix [--reference-top 78]
Outputs a 50% overlay, absolute RGB difference and measured JSON.
Different API content and JPEG colour capture affect these metrics: this is
diagnostic evidence, not a perceptual design score.
"""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops


def compare(reference, actual, prefix, reference_top=0):
    reference = Image.open(reference).convert("RGB")
    actual = Image.open(actual).convert("RGB")
    width, height = actual.size
    if reference.width != width or reference.height - reference_top < height:
        raise ValueError("Reference must contain the exact actual viewport; resizing is prohibited")
    reference = reference.crop((0, reference_top, width, reference_top + height))
    delta = np.abs(np.asarray(reference, dtype=np.int16) - np.asarray(actual, dtype=np.int16))
    result = {
        "width": width, "height": height, "reference_top_crop": reference_top,
        "mean_absolute_rgb_error_0_255": float(delta.mean()),
        "pixels_with_any_channel_error_over_16_percent": float((delta.max(axis=2) > 16).mean() * 100),
        "normalization": "reference crop only; original screenshots unchanged",
    }
    prefix = Path(prefix)
    prefix.parent.mkdir(parents=True, exist_ok=True)
    Image.blend(reference, actual, 0.5).save(str(prefix) + "-overlay.png")
    ImageChops.difference(reference, actual).save(str(prefix) + "-diff.png")
    Path(str(prefix) + "-metrics.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reference")
    parser.add_argument("actual")
    parser.add_argument("output_prefix")
    parser.add_argument("--reference-top", type=int, default=0)
    args = parser.parse_args()
    print(json.dumps(compare(args.reference, args.actual, args.output_prefix, args.reference_top)))
