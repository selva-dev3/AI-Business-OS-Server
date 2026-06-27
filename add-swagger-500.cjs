/**
 * Script to add 500 Internal Server Error response to all Swagger-documented API endpoints
 * that are missing it, AND add full Swagger JSDoc comments to routes that have none.
 */
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

// The 500 response block to add (swagger comment format)
const RESPONSE_500 = `\
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'`;

// ─────────────────────────────────────────────────────────────────────────────
// PART 1: Add 500 to existing swagger blocks that are missing it
// ─────────────────────────────────────────────────────────────────────────────
function addMissing500ToExistingSwagger(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all swagger comment blocks
  const swaggerBlockRegex = /\/\*\*\s*\n\s*\*\s*@swagger[\s\S]*?\*\//g;
  let modified = false;
  
  content = content.replace(swaggerBlockRegex, (block) => {
    // Skip if it already has a 500 response
    if (block.includes('500:')) {
      return block;
    }
    
    // Check if this block has a responses section
    if (!block.includes('responses:')) {
      return block;
    }
    
    // Find the last response code block and add 500 after it
    // Look for the pattern: the last response entry before the closing */
    const closingIndex = block.lastIndexOf(' */');
    if (closingIndex === -1) return block;
    
    // Insert 500 response before the closing */
    const newBlock = block.slice(0, closingIndex) + RESPONSE_500 + '\n' + block.slice(closingIndex);
    modified = true;
    return newBlock;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated existing swagger blocks in: ${path.basename(filePath)}`);
  }
  return modified;
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 2: Add full swagger comments to route files that have none
// ─────────────────────────────────────────────────────────────────────────────

function inferRoutePrefix(filename) {
  // From route filename, infer the base path
  const map = {
    'hrms.routes.ts': '/hrms',
    'inventory.routes.ts': '/inventory',
    'procurement.routes.ts': '/procurement',
    'project.routes.ts': '/projects',
    'support.routes.ts': '/support',
    'settings.routes.ts': '/settings',
    'user.routes.ts': '/users',
    'notification.routes.ts': '/notifications',
  };
  return map[filename] || '/' + filename.replace('.routes.ts', '');
}

function inferTag(filename) {
  const map = {
    'hrms.routes.ts': 'HRMS',
    'inventory.routes.ts': 'Inventory',
    'procurement.routes.ts': 'Procurement',
    'project.routes.ts': 'Projects',
    'support.routes.ts': 'Support',
    'settings.routes.ts': 'Settings',
    'user.routes.ts': 'Users',
    'notification.routes.ts': 'Notifications',
  };
  return map[filename] || filename.replace('.routes.ts', '').charAt(0).toUpperCase() + filename.replace('.routes.ts', '').slice(1);
}

function inferTagDescription(tag) {
  const map = {
    'HRMS': 'Human Resource Management System - Employees, Departments, Attendance, Leaves, Payroll, Assets',
    'Inventory': 'Inventory Management - Products, Categories, Warehouses, Stock, Transfers',
    'Procurement': 'Procurement Management - Vendors, RFQs, Purchase Orders, Receipts',
    'Projects': 'Project Management - Projects, Tasks, Milestones, Timesheets, Comments',
    'Support': 'Support Ticketing System - Tickets, Categories, Reports',
    'Settings': 'System Settings - Roles, Permissions, Email, Templates, Integrations, API Keys, Billing',
    'Users': 'User Management - Invite, Update, Roles, Profile',
    'Notifications': 'User Notifications - List, Read, Delete',
  };
  return map[tag] || `${tag} management`;
}

function httpMethodToVerb(method) {
  const map = {
    'get': 'Get',
    'post': 'Create',
    'patch': 'Update',
    'put': 'Update',
    'delete': 'Delete',
  };
  return map[method] || method;
}

function buildSummary(method, routePath, prefix) {
  // Clean up route path for a readable summary
  const cleanPath = routePath
    .replace(prefix, '')
    .replace(/^\//, '')
    .replace(/:[a-zA-Z]+/g, '')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const parts = cleanPath.split(' ').filter(Boolean);
  
  // Special cases
  if (parts.length === 0) {
    if (method === 'get') return 'List all records';
    if (method === 'post') return 'Create a new record';
    return `${httpMethodToVerb(method)} record`;
  }
  
  // Build a readable summary
  const resource = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' ');
  
  if (method === 'get' && !routePath.includes(':')) {
    return `List ${resource.toLowerCase()}`;
  }
  if (method === 'get' && routePath.includes(':')) {
    return `Get ${resource.toLowerCase()} by ID`;
  }
  if (method === 'post') {
    return `Create ${resource.toLowerCase()}`;
  }
  if (method === 'patch' || method === 'put') {
    return `Update ${resource.toLowerCase()}`;
  }
  if (method === 'delete') {
    return `Delete ${resource.toLowerCase()}`;
  }
  
  return `${httpMethodToVerb(method)} ${resource.toLowerCase()}`;
}

function getSwaggerPath(routePath) {
  // Convert Express :param to {param}
  return routePath.replace(/:([a-zA-Z]+)/g, '{$1}');
}

function getSuccessCode(method) {
  if (method === 'post') return '201';
  return '200';
}

function getSuccessDesc(method) {
  if (method === 'post') return 'Created successfully';
  if (method === 'delete') return 'Deleted successfully';
  return 'Success';
}

function buildSwaggerComment(method, routePath, tag, prefix, hasAuth) {
  const swaggerPath = getSwaggerPath(routePath);
  const summary = buildSummary(method, routePath, prefix);
  const successCode = getSuccessCode(method);
  const successDesc = getSuccessDesc(method);
  
  // Detect path parameters
  const pathParams = [];
  const paramRegex = /\{([a-zA-Z]+)\}/g;
  let match;
  while ((match = paramRegex.exec(swaggerPath)) !== null) {
    pathParams.push(match[1]);
  }
  
  let comment = `/**\n`;
  comment += ` * @swagger\n`;
  comment += ` * ${swaggerPath}:\n`;
  comment += ` *   ${method}:\n`;
  comment += ` *     summary: ${summary}\n`;
  comment += ` *     tags: [${tag}]\n`;
  
  if (hasAuth) {
    comment += ` *     security:\n`;
    comment += ` *       - bearerAuth: []\n`;
  }
  
  // Path parameters
  if (pathParams.length > 0) {
    comment += ` *     parameters:\n`;
    for (const param of pathParams) {
      comment += ` *       - in: path\n`;
      comment += ` *         name: ${param}\n`;
      comment += ` *         required: true\n`;
      comment += ` *         schema:\n`;
      comment += ` *           type: string\n`;
      comment += ` *         description: The ${param} parameter\n`;
    }
  }
  
  comment += ` *     responses:\n`;
  comment += ` *       ${successCode}:\n`;
  comment += ` *         description: ${successDesc}\n`;
  comment += ` *         content:\n`;
  comment += ` *           application/json:\n`;
  comment += ` *             schema:\n`;
  comment += ` *               $ref: '#/components/schemas/ApiSuccess'\n`;
  comment += ` *       400:\n`;
  comment += ` *         description: Invalid input or bad request\n`;
  comment += ` *         content:\n`;
  comment += ` *           application/json:\n`;
  comment += ` *             schema:\n`;
  comment += ` *               $ref: '#/components/schemas/ApiError'\n`;
  
  if (hasAuth) {
    comment += ` *       401:\n`;
    comment += ` *         description: Unauthorized — missing or invalid token\n`;
    comment += ` *         content:\n`;
    comment += ` *           application/json:\n`;
    comment += ` *             schema:\n`;
    comment += ` *               $ref: '#/components/schemas/ApiError'\n`;
  }
  
  comment += ` *       500:\n`;
  comment += ` *         description: Internal server error\n`;
  comment += ` *         content:\n`;
  comment += ` *           application/json:\n`;
  comment += ` *             schema:\n`;
  comment += ` *               $ref: '#/components/schemas/ApiError'\n`;
  comment += ` */`;
  
  return comment;
}

function addSwaggerToUndocumentedRoutes(filePath) {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const prefix = inferRoutePrefix(filename);
  const tag = inferTag(filename);
  const tagDesc = inferTagDescription(tag);
  
  // Check if file already has swagger comments on its routes
  const hasSwaggerOnRoutes = content.includes('@swagger') && 
    (content.includes('responses:'));
  
  // Parse route registrations
  // Match: router.METHOD('path', ...)
  const routeRegex = /^(router\.(get|post|patch|put|delete)\(['"]([^'"]+)['"]\s*,)/;
  
  let newLines = [];
  let addedTag = false;
  let hasAuth = content.includes('router.use(authenticate)');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Add tag definition after imports (before first router usage)
    if (!addedTag && (trimmed.startsWith('router.use(') || routeRegex.test(trimmed))) {
      // Check if tag already exists
      if (!content.includes(`name: ${tag}`) && !content.includes(`* tags:`)) {
        newLines.push(`/**`);
        newLines.push(` * @swagger`);
        newLines.push(` * tags:`);
        newLines.push(` *   name: ${tag}`);
        newLines.push(` *   description: ${tagDesc}`);
        newLines.push(` */`);
        newLines.push('');
      }
      addedTag = true;
    }
    
    // Check if this is a route line
    const routeMatch = trimmed.match(routeRegex);
    if (routeMatch) {
      const method = routeMatch[2];
      const routePath = routeMatch[3];
      const fullPath = prefix + (routePath === '/' ? '' : routePath);
      
      // Check if previous lines already have a swagger comment for this route
      let hasSwagger = false;
      for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
        if (lines[j].trim().includes('*/')) {
          // Check if it's a swagger comment
          for (let k = j; k >= Math.max(0, j - 30); k--) {
            if (lines[k].includes('@swagger')) {
              hasSwagger = true;
              break;
            }
            if (lines[k].trim() === '' && !lines[k + 1]?.includes('*')) {
              break;
            }
          }
          break;
        }
        if (lines[j].trim() === '' || lines[j].trim().startsWith('//')) {
          continue;
        }
        break;
      }
      
      if (!hasSwagger) {
        const isAuthenticatedRoute = hasAuth || line.includes('authenticate');
        const swaggerComment = buildSwaggerComment(method, fullPath, tag, prefix, isAuthenticatedRoute);
        newLines.push(swaggerComment);
      }
    }
    
    newLines.push(line);
  }
  
  const newContent = newLines.join('\n');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added swagger comments to: ${filename}`);
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
console.log('🔄 Processing route files...\n');

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.routes.ts'));

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(routesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has swagger comments with responses
  const hasSwaggerResponses = content.includes('@swagger') && content.includes('responses:');
  
  if (hasSwaggerResponses) {
    // PART 1: Add 500 to existing swagger that's missing it
    if (addMissing500ToExistingSwagger(filePath)) {
      updatedCount++;
    }
  }
  
  // PART 2: Add swagger comments to routes with no swagger
  if (addSwaggerToUndocumentedRoutes(filePath)) {
    updatedCount++;
  }
}

console.log(`\n✨ Done! Updated ${updatedCount} files.`);
