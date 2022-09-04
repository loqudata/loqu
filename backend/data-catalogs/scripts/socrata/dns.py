
import dns.resolver



# Basic query
for rdata in dns.resolver.query('www.yahoo.com', 'CNAME') :
    print rdata.target