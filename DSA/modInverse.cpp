// Computes modular inverses for all 1..n modulo m (m must be prime)
vector<long long> modInverseRange(int n, int m) {
    vector<long long> inv(n + 1, 0);
    inv[1] = 1; // base case
    for (int i = 2; i <= n; i++) {
        inv[i] = (m - (m / i) * inv[m % i] % m) % m;
    }
    return inv;
}

//Fermat's theorem can be used when range of mod inverses is not required
// a^(-1) mod m = a^(m-2) mod m