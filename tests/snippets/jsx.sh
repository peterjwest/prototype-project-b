#!/bin/bash

set -euo pipefail

babel $1 | node
