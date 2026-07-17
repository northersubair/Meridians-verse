# Error Handling Quick Reference

One-page cheat sheet for the error handling refactoring.

## 🎯 Key Changes

**Before**: `panic!("error message")`  
**After**: `return Err(ErrorVariant)`

All functions now return: `Result<T, ErrorEnum>`

## 📋 Error Enums by Contract

### Escrow (`EscrowError`)

```rust
use stellar_insured_lib::EscrowError;

pub fn some_function(env: Env, ...) -> Result<T, EscrowError> {
    if condition {
        return Err(EscrowError::InvalidNonce);
    }
    Ok(value)
}
```

**Error Codes**: 1-10  
**Most Common**: `Unauthorized`, `InvalidNonce`, `EscrowNotFound`

### Risk Pool (`RiskPoolError`)

```rust
use stellar_insured_lib::RiskPoolError;

pub fn deposit_liquidity(...) -> Result<(), RiskPoolError> {
    if amount < min_stake {
        return Err(RiskPoolError::BelowMinimumStake);
    }
    Ok(())
}
```

**Error Codes**: 1-5  
**Most Common**: `NotInitialized`, `InsufficientPoolFunds`

### Governance (`GovernanceError`)

```rust
use stellar_insured_lib::GovernanceError;

pub fn vote(...) -> Result<(), GovernanceError> {
    if already_voted {
        return Err(GovernanceError::AlreadyVoted);
    }
    Ok(())
}
```

**Error Codes**: 1-11  
**Most Common**: `VotingPeriodEnded`, `ThresholdNotMet`

### Validation (`ValidationError`)

```rust
use stellar_insured_lib::ValidationError;

pub fn require_not_paused(env: &Env) -> Result<(), ValidationError> {
    if paused {
        return Err(ValidationError::ContractPaused);
    }
    Ok(())
}
```

**Error Codes**: 1-5  
**Usage**: Shared validation helpers

## 🔧 Common Patterns

### Pattern 1: Simple Error Return

```rust
if invalid_condition {
    return Err(ErrorEnum::Variant);
}
```

### Pattern 2: Error Propagation with `?`

```rust
require_not_paused(&env)?;  // Propagates ValidationError
require_positive_amount(amount, "amount")?;
```

### Pattern 3: Error Mapping

```rust
require_not_paused(&env)
    .map_err(|_| EscrowError::Unauthorized)?;
```

### Pattern 4: Option to Result

```rust
let escrow = env.storage().persistent()
    .get(&DataKey::Escrow(id))
    .ok_or(EscrowError::EscrowNotFound)?;
```

## 🧪 Testing Patterns

### Test Success Case

```rust
#[test]
fn test_success() {
    let result = contract.function(&args);
    assert!(result.is_ok());
    let value = result.unwrap();
    assert_eq!(value, expected);
}
```

### Test Error Case

```rust
#[test]
fn test_error() {
    let result = contract.function(&invalid_args);
    assert!(result.is_err());
    // Or check specific error:
    assert_eq!(result.unwrap_err(), ErrorEnum::Variant);
}
```

## 💻 SDK Integration

### TypeScript

```typescript
import { EscrowError } from './errors';

try {
  const result = await contract.createEscrow(params);
} catch (error) {
  if (error.code === EscrowError.INVALID_NONCE) {
    // Handle specific error
  }
}
```

### Python

```python
from errors import EscrowError, ContractError

try:
    result = contract.create_escrow(params)
except ContractError as e:
    if e.code == EscrowError.INVALID_NONCE:
        # Handle specific error
        pass
```

## 📊 Error Code Map

| Contract | Enum | Codes | Import |
|----------|------|-------|--------|
| Escrow | `EscrowError` | 1-10 | `stellar_insured_lib::EscrowError` |
| Risk Pool | `RiskPoolError` | 1-5 | `stellar_insured_lib::RiskPoolError` |
| Governance | `GovernanceError` | 1-11 | `stellar_insured_lib::GovernanceError` |
| Validation | `ValidationError` | 1-5 | `stellar_insured_lib::ValidationError` |
| Oracle | `OracleError` | 1-2 | `stellar_insured_lib::OracleError` |

## 🚀 Quick Commands

```bash
# Build all
cargo build --release

# Test all
cargo test --all

# Check specific contract
cargo check --package escrow

# Lint
cargo clippy --all

# Format
cargo fmt --all

# Run test script
./scripts/test-error-refactoring.sh
# or on Windows:
.\scripts\test-error-refactoring.ps1
```

## ⚠️ Breaking Changes

### Contract Functions

**Old Signature**:
```rust
pub fn create_escrow(...) -> u64
```

**New Signature**:
```rust
pub fn create_escrow(...) -> Result<u64, EscrowError>
```

### SDK Calls

**Old**:
```typescript
const id = await contract.createEscrow(params);
```

**New**:
```typescript
const result = await contract.createEscrow(params);
if (result.isErr()) {
  throw new ContractError(result.error);
}
const id = result.unwrap();
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `ERROR_REFACTORING_SUMMARY.md` | High-level overview |
| `docs/ERROR_HANDLING_REFACTORING.md` | Technical specification |
| `docs/ERROR_TESTING_GUIDE.md` | Test patterns & examples |
| `docs/SDK_ERROR_MIGRATION.md` | SDK integration guide |
| `ERROR_CODES.md` | Error code reference |
| `ERROR_QUICK_REFERENCE.md` | This cheat sheet |

## 🐛 Common Issues

### Issue: "cannot find type `EscrowError`"

**Solution**: Add import
```rust
use stellar_insured_lib::EscrowError;
```

### Issue: "mismatched types, expected `T`, found `Result<T, E>`"

**Solution**: Function signature changed, update caller
```rust
// Old
let value = function();

// New
let value = function()?;  // Propagate error
// or
let value = function().unwrap();  // Only in tests!
```

### Issue: Tests failing with "no method named `unwrap`"

**Solution**: Update test assertions
```rust
// Old
assert_eq!(contract.function(), expected);

// New
assert_eq!(contract.function().unwrap(), expected);
```

## ✅ Validation Checklist

Before committing:

- [ ] All functions return `Result<T, ErrorEnum>`
- [ ] No `panic!()` calls in main code (tests OK)
- [ ] All imports include error types
- [ ] Error propagation uses `?` operator
- [ ] Tests updated to handle Results
- [ ] Documentation updated
- [ ] `cargo check` passes
- [ ] `cargo clippy` clean
- [ ] `cargo test` passes

## 🎓 Learning Resources

### Rust Error Handling

- [The Rust Book - Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [Rust by Example - Error Handling](https://doc.rust-lang.org/rust-by-example/error.html)

### Soroban Specifics

- [Soroban Errors](https://soroban.stellar.org/docs/learn/errors)
- [contracterror Attribute](https://docs.rs/soroban-sdk/latest/soroban_sdk/attr.contracterror.html)

## 💡 Tips

1. **Use `?` for propagation**: Don't manually match and return
2. **Specific errors**: Create new variants rather than generic "Error"
3. **User-friendly messages**: Error enums enable good SDK messages
4. **Test error paths**: Write tests for each error variant
5. **Document recovery**: Tell users how to fix each error

## 🔗 Quick Links

- Main refactoring doc: `docs/ERROR_HANDLING_REFACTORING.md`
- Test guide: `docs/ERROR_TESTING_GUIDE.md`
- SDK migration: `docs/SDK_ERROR_MIGRATION.md`
- Error codes: `ERROR_CODES.md`

---

**Last Updated**: 2026-07-17  
**Version**: 1.0.0
