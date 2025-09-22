bool isDivisibleByPowerOf2(int n, int k) { // if n is divisible by 2^k
    int powerOf2 = 1 << k;
    return (n & (powerOf2 - 1)) == 0;
}


// Count set bits upto  n
// We can use the fact that for numbers upto  2^x (i.e. from  1  to  2^x - 1 ) 
// there are  x*2^{x-1}  set bits. This can be visualised as follows.
// 0 ->   0 0 0 0
// 1 ->   0 0 0 1
// 2 ->   0 0 1 0
// 3 ->   0 0 1 1
// 4 ->   0 1 0 0
// 5 ->   0 1 0 1
// 6 ->   0 1 1 0
// 7 ->   0 1 1 1
// 8 ->   1 0 0 0

// With the new knowledge in hand we can come up with the following algorithm:

// Find the highest power of  2  that is lesser than or equal to the given number. Let this number be  x .
// Calculate the number of set bits from  1  to  2^x - 1  by using the formula  x*2^{x-1} .
// Count the no. of set bits in the most significant bit from  2^x  to  n  and add it.
// Subtract  2^x  from  n  and repeat the above steps using the new  n .

int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            int x = std::bit_width(n) - 1;
            count += 1 << (x - 1);
            n -= 1 << x;
            count += n + 1; // Count the set bits in the most significant bit from 2^x to n
        }
        return count;
}

// Additional tricks
// $n ~\&~ (n + 1)$  clears all trailing ones
// $n ~|~ (n + 1)$  sets the last cleared bit   
// $n ~\&~ -n$  extracts the last set bit


// int main() {
//     unsigned int x = 9; // binary: 1001
//     std::cout << std::bit_width(x) << std::endl; // Output: 4
// }

// std::bit_width is a C++20 function that returns the number of bits needed to represent a given unsigned integer value, excluding any leading zeros.