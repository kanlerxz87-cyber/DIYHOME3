import unittest
from check import audit_rows
class SourceRowTests(unittest.TestCase):
 def test_official_https(self):self.assertEqual(audit_rows('<table><tr><td><a href="https://www.amazon.com/dp/B08FKW9JRM">Listing</a></td></tr></table>'),[])
 def test_empty_cells_not_silently_ignored(self):self.assertEqual(audit_rows('<table><tr><td></td></tr></table>'),[1])
 def test_lookalike_domain_rejected(self):self.assertEqual(audit_rows('<tr><td><a href="https://www.amazon.com.evil.example">x</a></td></tr>'),[1])
 def test_header_not_a_data_row(self):self.assertEqual(audit_rows('<table><tr><th>Source</th></tr></table>'),[])
 def test_http_not_verified_transport(self):self.assertEqual(audit_rows('<tr><td><a href="http://www.amazon.com">x</a></td></tr>'),[1])
if __name__=='__main__':unittest.main()
