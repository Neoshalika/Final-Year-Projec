package bit.project.server.dao;

import bit.project.server.entity.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface LoanDao extends JpaRepository<Loan, Integer>{
    @Query("select new Loan (l.id,l.code,l.employee,l.paymenttype,l.date,l.amount,l.chequeno) from Loan l")
    Page<Loan> findAllBasic(PageRequest pageRequest);

    Loan findByCode(String code);
}